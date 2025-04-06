const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');

const Game = require('../models/game');
const User = require('../models/user');

const addGame = async (req, res, next) => {
    const { tournament, opponent, score, playerStats } = req.body;
  
    try {
      // Kreiramo novu utakmicu
      const game = new Game({
        tournament,
        opponent,
        score,  // Rezultat utakmice
        playerStats  // Statistika igrača
      });
  
      // Spremamo utakmicu u bazu
      await game.save();
  
       // Ažuriraj statistiku svakog igrača
    for (const stat of playerStats) {
      const { playerId, goals, assists } = stat;
      
      await User.findByIdAndUpdate(playerId, {
        $inc: { 
          matchesPlayed: 1,  // Povećaj broj nastupa
          goals: goals,       // Dodaj broj golova
          assists: assists    // Dodaj broj asistencija
        }
      });
    }
  
      // Vraćamo odgovor s ID-em nove utakmice
      res.status(201).json({ message: 'Game added successfully', gameId: game.id });
    } catch (err) {
      return next(new HttpError('Something went wrong. Try again later.', 500));
    }
  };


exports.addGame=addGame;
