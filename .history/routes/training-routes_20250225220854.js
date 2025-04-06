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
router.patch("/signup/:trainingId",checkAuth, trainingsController.signUpForTraining);
router.patch("/signup-unregistered-player/:trainingId",
  [
    check("name").not().isEmpty(),
  ],
  checkAuth,
  trainingsController.signUpUnregisteredPlayer
);

router.patch("/cancel/:trainingId", checkAuth,trainingsController.cancelTraining);
router.delete("/:trainingId", trainingsController.deleteTraining);

module.exports = router;

