const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');



const Game = require('../models/game');
const User = require('../models/user');


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
          $inc: { 'User.matchesPlayed': 1 }  // Povećavamo matchesPlayed za 1
        });
      }
  
      // Vraćamo odgovor s ID-em nove utakmice
      res.status(201).json({ message: 'Game added successfully', gameId: game.id });
    } catch (err) {
      return next(new HttpError('Something went wrong. Try again later.', 500));
    }
  };
  


exports.addGame=addGame;
exports.getUsers = getUsers;
