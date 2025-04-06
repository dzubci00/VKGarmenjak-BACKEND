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
  
// Dohvati sve utakmice s podacima o turniru i igračima
const getAllGames = async (req, res, next) => {
  try {
    // Dohvati sve utakmice s podacima o turniru i igračima, sortirane po datumu turnira
    const games = await Game.find()
      .populate("tournament", "name date") // Dohvati ime i datum turnira
      .populate("playerStats.playerId", "name surname") // Dohvati ime i prezime igrača
      .sort({ "tournament.date": 1 }); // Sortiranje po datumu turnira

    // Grupiraj utakmice po turniru
    const tournamentsMap = new Map();

    games.forEach((game) => {
      const tournamentId = game.tournament._id.toString();

      if (!tournamentsMap.has(tournamentId)) {
        tournamentsMap.set(tournamentId, {
          name: game.tournament.name,
          date: game.tournament.date,
          games: []
        });
      }

      tournamentsMap.get(tournamentId).games.push({
        opponent: game.opponent,
        score: game.score,
        playerStats: game.playerStats.map((stat) => ({
          playerId: {
            name: stat.playerId.name,
            surname: stat.playerId.surname
          },
          goals: stat.goals,
          assists: stat.assists
        }))
      });
    });

    // Pretvori mapu u array i pošalji response
    res.json({ tournaments: Array.from(tournamentsMap.values()) });

  } catch (err) {
    return next(new HttpError("Fetching games failed, try again later.", 500));
  }
};


exports.addGame=addGame;
exports.getAllGames=getAllGames;