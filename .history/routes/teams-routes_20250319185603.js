const express = require("express");
const { check } = require("express-validator");

const teamscontroller = require("../controllers/teams-controller");
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get("/", tournamentController.getTournaments);

router.post(
  "/add-team",
  [check("teamName").not().isEmpty().withMessage("Name of team is required")],
  tournamentController.addTournament
);

router.get("/league-table", tournamentController.getLeaguTable);

module.exports = router;
