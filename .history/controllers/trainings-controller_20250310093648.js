const HttpError = require("../models/http-error");
const Training = require("../models/training");
const User = require("../models/user");
const { validationResult } = require('express-validator');

const addTraining = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input. Double-check your details and try again!', 422));
  }

  const { date, time, location, trainingType } = req.body;

  const newTraining = new Training({ date, time, location, trainingType, players: [], unregisteredPlayers: [] });

  try {
    await newTraining.save();
    res.status(201).json({ message: "Training added", training: newTraining });
  } catch (err) {
    return next(new HttpError("Failed to add training, try again.", 500));
  }
};

const getTrainings = async (req, res, next) => {
  try {
    const trainings = await Training.find().populate("players.playerId", "name surname");

    res.json({
      trainings: trainings.map((training) =>
        training.toObject({ getters: true })
      ),
    });
  } catch (err) {
    return next(new HttpError("Fetching trainings failed, please try again later.", 500));
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
    const alreadySignedUp = training.players.some((player) => player.playerId.toString() === userId);
    if (alreadySignedUp) {
      return res.status(422).json({ message: "Player is already signed up for this training." });
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
    return next(new HttpError("Invalid input. Double-check your details and try again!", 422));
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

    res.status(200).json({ message: "Unregistered player signed up for training" });
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
    const playerIndex = training.players.findIndex(player => player.playerId.toString() === userId);
    if (playerIndex === -1) {
      return next(new HttpError("Player is not signed up for this training.", 400));
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
    const playerExists = training.unregisteredPlayers.some(player => player.name === name);
    if (!playerExists) {
      return next(new HttpError("Player not found in training signup list.", 404));
    }

    // Uklanjanje igrača
    training.unregisteredPlayers = training.unregisteredPlayers.filter(player => player.name !== name);
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

  // Kreiraj prvi dan mjeseca u UTC vremenskoj zoni
  const firstDay = new Date(Date.UTC(year, month, 1)); // Prvi dan mjeseca u UTC
  const lastDay = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59)); // Posljednji dan mjeseca u UTC (s krajem dana)

  try {
    const user=await Training.findById(userId);

    const trening = await Training.findOne({
      date: { $gte: firstDay, $lte: lastDay }
    });
    
    const attendanceCount = await Training.countDocuments({
      date: { 
        $gte: firstDay, 
        $lte: lastDay
      },
      "players._id": userId
    });

    res.json({ userId, attendanceCount });
  } catch (err) {
    return next(new HttpError("Fetching attendance failed, try again.", 500));
  }
};


exports.addTraining = addTraining;
exports.getTrainings = getTrainings;
exports.signUpForTraining = signUpForTraining;
exports.signUpUnregisteredPlayer=signUpUnregisteredPlayer;
exports.cancelTraining = cancelTraining;
exports.cancelTrainingUnregisteredPlayer=cancelTrainingUnregisteredPlayer;
exports.deleteTraining = deleteTraining;
exports.getMonthlyAttendance=getMonthlyAttendance;
