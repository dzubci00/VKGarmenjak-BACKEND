const HttpError = require("../models/http-error");
const Training = require("../models/training");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const isValidTimeFormat = (timeStr) =>
  /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(timeStr);

const isFutureDateTime = (dateStr, timeStr) => {
  const trainingDateTime = new Date(`${dateStr}T${timeStr}`);
  return !isNaN(trainingDateTime) && trainingDateTime > new Date();
};

const addTraining = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid input. Double-check your details and try again!",
        422
      )
    );
  }

  const { date, time, location, trainingType } = req.body;

  // 1. Validacija formata vremena
  if (!isValidTimeFormat(time)) {
    return next(new HttpError("Vrijeme mora biti u formatu HH:mm.", 422));
  }

  // 2. Validacija da je datum i vrijeme u budućnosti
  if (!isFutureDateTime(date, time)) {
    return next(
      new HttpError("Datum i vrijeme moraju biti u budućnosti.", 422)
    );
  }

  // 3. Provjera duplikata
  try {
    const existingTraining = await Training.findOne({ date, time, location });
    if (existingTraining) {
      return next(
        new HttpError("Trening na ovoj lokaciji i vremenu već postoji.", 409)
      );
    }
  } catch (err) {
    return next(new HttpError("Greška pri provjeri postojećih treninga.", 500));
  }

  const newTraining = new Training({
    date,
    time,
    location,
    trainingType,
    players: [],
    unregisteredPlayers: [],
  });

  try {
    await newTraining.save();
    res.status(201).json({ message: "Training added", training: newTraining });
  } catch (err) {
    return next(new HttpError("Failed to add training, try again.", 500));
  }
};

const getTrainings = async (req, res, next) => {
  try {
    const trainings = await Training.find()
      .populate("players.playerId", "name surname")
      .sort({ date: 1, time: 1 }); // po datumu i vremenu

    const getStatus = (dateStr, timeStr) => {
      const date = new Date(dateStr); // primjer: 2025-04-11T00:00:00.000Z
      const [hours, minutes] = timeStr.split(":").map(Number);

      const start = new Date(date);
      start.setHours(hours);
      start.setMinutes(minutes);
      start.setSeconds(0);
      start.setMilliseconds(0);

      const now = new Date();
      const end = new Date(start.getTime() + 90 * 60000); // +1h30m

      if (now < start) return "A"; // Aktivan
      if (now >= start && now <= end) return "UT"; // U tijeku
      return "Z"; // Završeno
    };

    const trainingsWithStatus = trainings.map((training) => {
      const obj = training.toObject({ getters: true });
      obj.status = getStatus(training.date, training.time);
      return obj;
    });

    res.json({ trainings: trainingsWithStatus });
  } catch (err) {
    return next(
      new HttpError("Fetching trainings failed, please try again later.", 500)
    );
  }
};

const signUpForTraining = async (req, res, next) => {
  const trainingId = req.params.trainingId;

  // ✅ 1. Provjera autentifikacije korisnika
  if (!req.userData || !req.userData.userId) {
    return next(new HttpError("User authentication failed.", 401));
  }

  const userId = req.userData.userId;

  try {
    // ✅ 2. Pronalaženje treninga
    const training = await Training.findById(trainingId);
    if (!training) {
      return next(new HttpError("Training not found.", 404));
    }

    // ✅ 3. Provjera je li korisnik već prijavljen
    const alreadySignedUp = training.players.some(
      (player) => player.playerId.toString() === userId
    );
    if (alreadySignedUp) {
      return res
        .status(422)
        .json({ message: "Player is already signed up for this training." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    // ✅ 4. Dodavanje igrača na popis (ispravan način)
    training.players.push({ playerId: user._id });

    await training.save();

    res.status(200).json({ message: "Signed up for training successfully." });
  } catch (err) {
    return next(new HttpError("Could not sign up, try again.", 500));
  }
};

const signUpUnregisteredPlayer = async (req, res, next) => {
  const trainingId = req.params.trainingId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid input. Double-check your details and try again!",
        422
      )
    );
  }

  const { name } = req.body;

  if (!name) {
    return next(new HttpError("Player name is required.", 400));
  }

  try {
    const training = await Training.findById(trainingId);
    if (!training) {
      return next(new HttpError("Training not found.", 404));
    }

    // Provjera da isti igrač nije već prijavljen
    const isAlreadySignedUp = training.unregisteredPlayers.some(
      (player) => player.name === name
    );

    if (isAlreadySignedUp) {
      return next(new HttpError("Player is already signed up.", 400));
    }

    // Dodavanje neregistriranog igrača
    training.unregisteredPlayers.push({ name });
    await training.save();

    res
      .status(200)
      .json({ message: "Unregistered player signed up for training" });
  } catch (err) {
    return next(new HttpError("Could not sign up, try again.", 500));
  }
};

const cancelTraining = async (req, res, next) => {
  const trainingId = req.params.trainingId;
  const userId = req.userData.userId;

  try {
    const training = await Training.findById(trainingId);
    if (!training) return next(new HttpError("Training not found.", 404));

    // Provjera je li korisnik već u listi igrača
    const playerIndex = training.players.findIndex(
      (player) => player.playerId.toString() === userId
    );
    if (playerIndex === -1) {
      return next(
        new HttpError("Player is not signed up for this training.", 400)
      );
    }

    // Uklanjanje igrača
    training.players.splice(playerIndex, 1);
    await training.save();

    res.status(200).json({ message: "Player canceled training signup" });
  } catch (err) {
    return next(new HttpError("Could not cancel signup, try again.", 500));
  }
};

const cancelTrainingUnregisteredPlayer = async (req, res, next) => {
  const trainingId = req.params.trainingId;
  const { name } = req.body; // Unregistered player is identified by name

  try {
    const training = await Training.findById(trainingId);
    if (!training) {
      return next(new HttpError("Training not found.", 404));
    }

    // Provjera postoji li igrač na popisu
    const playerExists = training.unregisteredPlayers.some(
      (player) => player.name === name
    );
    if (!playerExists) {
      return next(
        new HttpError("Player not found in training signup list.", 404)
      );
    }

    // Uklanjanje igrača
    training.unregisteredPlayers = training.unregisteredPlayers.filter(
      (player) => player.name !== name
    );
    await training.save();

    res.status(200).json({ message: "Player canceled training signup" });
  } catch (err) {
    return next(new HttpError("Could not cancel signup, try again.", 500));
  }
};

const deleteTraining = async (req, res, next) => {
  const trainingId = req.params.trainingId;

  try {
    const training = await Training.findByIdAndDelete(trainingId);
    if (!training) return next(new HttpError("Training not found.", 404));

    res.status(200).json({ message: "Training deleted" });
  } catch (err) {
    return next(new HttpError("Could not delete training, try again.", 500));
  }
};

const getMonthlyAttendance = async (req, res, next) => {
  const userId = req.userData.userId;
  const now = new Date();

  // Dohvati lokalni mjesec i godinu
  const year = now.getFullYear();
  const month = now.getMonth();

  // Kreiraj prvi i posljednji dan mjeseca u UTC vremenskoj zoni
  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  try {
    // Ukupno treninga u mjesecu
    const totalTrainings = await Training.countDocuments({
      date: { $gte: firstDay, $lte: lastDay },
    });

    // Broj treninga na kojima je korisnik prisustvovao
    const attendanceCount = await Training.countDocuments({
      date: { $gte: firstDay, $lte: lastDay },
      "players.playerId": userId,
    });

    res.json({
      userId,
      attendanceCount,
      totalTrainings,
    });
  } catch (err) {
    return next(new HttpError("Fetching attendance failed, try again.", 500));
  }
};

exports.addTraining = addTraining;
exports.getTrainings = getTrainings;
exports.signUpForTraining = signUpForTraining;
exports.signUpUnregisteredPlayer = signUpUnregisteredPlayer;
exports.cancelTraining = cancelTraining;
exports.cancelTrainingUnregisteredPlayer = cancelTrainingUnregisteredPlayer;
exports.deleteTraining = deleteTraining;
exports.getMonthlyAttendance = getMonthlyAttendance;
