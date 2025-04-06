const HttpError = require("../models/http-error");
const Training = require("../models/training");
const { validationResult } = require('express-validator');

const addTraining = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input. Double-check your details and try again!', 422));
  }

  const { date, time, location, trainigType } = req.body;

  const newTraining = new Training({ date, time, location, trainigType, players: [], unregisteredPlayers: [] });

  try {
    await newTraining.save();
    res.status(201).json({ message: "Training added", training: newTraining });
  } catch (err) {
    return next(new HttpError("Failed to add training, try again.", 500));
  }
};

const getTrainings = async (req, res, next) => {
  try {
    const trainings = await Training.find().populate("players", "name surname");
    res.json({ trainings });
  } catch (err) {
    return next(new HttpError("Fetching trainings failed, try again.", 500));
  }
};

const signUpForTraining = async (req, res, next) => {
  const trainingId = req.params.trainingId;
  const userId = req.userData.userId; 

  try {
    const training = await Training.findById(trainingId);
    if (!training) return next(new HttpError("Training not found.", 404));

    if (!training.players.includes(userId)) {
      training.players.push(userId);
      await training.save();
    }

    res.status(200).json({ message: "Signed up for training" });
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

    res.status(200).json({ message: "Canceled training signup" });
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
exports.cancelTraining = cancelTraining;
exports.deleteTraining = deleteTraining;
