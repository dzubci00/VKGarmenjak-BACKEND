const express = require("express");
const { check } = require("express-validator");

const teamsController = require("../controllers/teams-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post(
  "/add-team",
  fileUpload.single("image"),
  [check("teamName").not().isEmpty().withMessage("Name of team is required")],
  teamsController.addTeam
);

router.get("/", teamsController.getTeams);

module.exports = router;
