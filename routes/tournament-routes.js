const express = require("express");
const { check } = require("express-validator");

const tournamentController = require("../controllers/tournament-controller");
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get("/", tournamentController.getTournaments);

router.post(
  "/add-tournament-teams",
  [
    check("date")
      .not()
      .isEmpty()
      .trim()
      .isISO8601()
      .withMessage("Invalid date format"),
    check("name")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Name of tournament is required"),
  ],
  tournamentController.addTournamentAndTeams
);

router.post(
  "/add-tournament",
  [
    check("date")
      .not()
      .isEmpty()
      .trim()
      .isISO8601()
      .withMessage("Invalid date format"),
    check("name")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Name of tournament is required"),
  ],
  tournamentController.addTournament
);

router.get("/league-table", tournamentController.getLeaguTable);

module.exports = router;
