const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const Tournament = require("../models/tournament");
const Team = require("../models/teams");

const getTeams = async (req, res, next) => {
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

const addTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input. Please check your data!", 422));
  }

  const { teamName } = req.body;

  try {
    // Provjera postoji li već turnir s istim imenom i datumom
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return next(new HttpError("Team with this name already exists!", 422));
    }

    // Kreiranje novog turnira sa praznim poretkom ekipa
    const team = new Team({
      teamName,
      pointsPerTournament: [], // Prazan niz, popunit će se kasnije
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

exports.getTeams = getTeams;
exports.addTeam = addTeam;
