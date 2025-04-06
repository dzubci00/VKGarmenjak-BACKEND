const HttpError = require("../models/http-error");
const Training = require("../models/training");
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
    const trainings = await Training.find();
    res.status(200).json({ trainings });
  } catch (err) {
    return next(new HttpError("Fetching trainings failed!", 500));
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
    if (training.players.includes(userId)) {
      return res.status(422).json({ message: "Player is already signed up for this training." });
    }

    // ✅ 4. Dodavanje igrača na popis
    training.players.push(userId);
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

    training.players = training.players.filter(id => id.toString() !== userId);
    await training.save();

    res.status(200).json({ message: "Player canceled training signup" });
  } catch (err) {
    return next(new HttpError("Could not cancel signup, try again.", 500));
  }
};

const cancelTrainingUnregisteredPlayer = async (req, res, next) => {
  const trainingId = req.params.trainingId;
  const userId = req.userData.userId; 

  try {
    const training = await Training.findById(trainingId);
    if (!training) return next(new HttpError("Training not found.", 404));

    training.players = training.players.filter(id => id.toString() !== userId);
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

exports.addTraining = addTraining;
exports.getTrainings = getTrainings;
exports.signUpForTraining = signUpForTraining;
exports.signUpUnregisteredPlayer=signUpUnregisteredPlayer;
exports.cancelTraining = cancelTraining;
exports.cancelTrainingUnregisteredPlayer=cancelTrainingUnregisteredPlayer;
exports.deleteTraining = deleteTraining;
