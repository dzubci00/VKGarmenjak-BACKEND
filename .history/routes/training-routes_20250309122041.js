const express = require("express");
const { check } = require("express-validator");
const trainingsController = require("../controllers/trainings-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//router.use(checkAuth);

router.post(
    "/add-training",
    [
      check("date").not().isEmpty(),
      check("time").not().isEmpty(),
      check("location").not().isEmpty(),
      check("trainingType").not().isEmpty(),
    ],
    trainingsController.addTraining
  );
  
router.get("/", trainingsController.getTrainings);
router.patch("/signup/:trainingId", trainingsController.signUpForTraining);
router.patch("/signup-unregistered-player/:trainingId",
  [
    check("name").not().isEmpty(),
  ],
  trainingsController.signUpUnregisteredPlayer
);

router.patch("/cancel/:trainingId", trainingsController.cancelTraining);
router.patch("/cancel-unregistered-player/:trainingId",[
  check("name").not().isEmpty(),
], trainingsController.cancelTrainingUnregisteredPlayer);

router.delete("/:trainingId", trainingsController.deleteTraining);

router.get("/attendance", trainingsController.getMonthlyAttendance);

module.exports = router;

