const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const Tournament = require("../models/tournament");
const Team = require("../models/table");

const getTournaments = async (req, res, next) => {
  let tournaments;
  try {
    tournaments = await Tournament.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching tournaments failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    tournaments: tournaments.map((tournament) =>
      tournament.toObject({ getters: true })
    ),
  });
};

const addTournament = async (req, res, next) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input. Please check your data!", 422));
  }

  const { name, date } = req.body;

  try {
    // Provjera postoji li turnir s istim imenom i datumom
    const existingTournament = await Tournament.findOne({ name, date });
    if (existingTournament) {
      return next(
        new HttpError("Tournament with this name and date already exists!", 422)
      );
    }

    // Kreiranje novog turnira
    const tournament = new Tournament({
      name,
      date,
    });

    await tournament.save();

    res.status(201).json({
      message: "Tournament added successfully",
      tournament: tournament,
    });
  } catch (err) {
    return next(new HttpError("Something went wrong. Try again later.", 500));
  }
};

const getLeaguTable = async (req, res, next) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Fetching league table failed." });
  }
};

exports.getTournaments = getTournaments;
exports.addTournament = addTournament;
exports.getLeaguTable = getLeaguTable;
