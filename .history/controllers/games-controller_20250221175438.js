const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');



const Game = require('../models/game');
const User = require('../models/user');
const Tournament = require('../models/tournament');


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const addGame = async (req, res, next) => {
    const { date, opponent, score, playerStats } = req.body;
  
    try {
      // Kreiramo novu utakmicu
      const game = new Game({
        date,
        opponent,
        score,  // Rezultat utakmice
        playerStats  // Statistika igrača
      });
  
      // Spremamo utakmicu u bazu
      await game.save();
  
      // Ažuriranje statistike igrača: Povećavamo matchesPlayed za svakog igrača
      for (const stat of playerStats) {
        const { playerId } = stat;
        
        // Ažuriramo matchesPlayed za svakog igrača koji je nastupio
        await User.findByIdAndUpdate(playerId, {
          $inc: { 'matchesPlayed': 1 }  // Povećavamo matchesPlayed za 1
        });
      }
  
      // Vraćamo odgovor s ID-em nove utakmice
      res.status(201).json({ message: 'Game added successfully', gameId: game.id });
    } catch (err) {
      return next(new HttpError('Something went wrong. Try again later.', 500));
    }
  };

  const addTournament = async (req, res, next) => {
    // Validacija unosa
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid input. Please check your data!', 422));
    }
  
    const { name, date } = req.body;
  
    try {
      // Provjera postoji li turnir s istim imenom i datumom
      const existingTournament = await Tournament.findOne({ name, date });
      if (existingTournament) {
        return next(new HttpError('Tournament with this name and date already exists!', 422));
      }
  
      // Kreiranje novog turnira
      const tournament = new Tournament({
        name,
        date,
      });
  
      await tournament.save();
  
      res.status(201).json({ 
        message: 'Tournament added successfully', 
        tournament: tournament 
      });
  
    } catch (err) {
      return next(new HttpError('Something went wrong. Try again later.', 500));
    }
  };
  


exports.addGame=addGame;
exports.getUsers = getUsers;
exports.addTournament = addTournament;
