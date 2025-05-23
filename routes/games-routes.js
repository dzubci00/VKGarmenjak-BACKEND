const express = require("express");
const { check } = require("express-validator");

const gamesController = require("../controllers/games-controller");
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get("/", gamesController.getAllGames);

router.post(
  "/add-game",
  [
    check("homeTeam")
      .not()
      .isEmpty()
      .trim()
      .withMessage("homeTeam name is required"),

    check("awayTeam")
      .not()
      .isEmpty()
      .trim()
      .withMessage("awayTeam name is required"),

    check("score")
      .not()
      .isEmpty()
      .trim()
      .matches(/^\d{1,2}-\d{1,2}(\(\d{1,2}-\d{1,2}\))?$/)
      .withMessage('Score must be in format "X-Y" or "X-Y(A-B)"'),

    check("phase").not().isEmpty().trim().withMessage("Phase is required"),

    check("tournament")
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage("Valid tournament ID is required"),
  ],
  gamesController.addGame
);

router.delete("/:gameId", gamesController.deleteGame);

module.exports = router;
