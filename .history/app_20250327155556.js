const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const gamesRoutes = require("./routes/games-routes");
const tournamentRoutes = require("./routes/tournament-routes");
const membershipRoutes = require("./routes/membership-routes");
const qrcodeRoutes = require("./routes/qrcode-routes");
const trainingRoutes = require("./routes/training-routes");
const teamsRoutes = require("./routes/teams-routes");
const newsRoutes = require("./routes/news-routes");

const HttpError = require("./models/http-error");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/news", newsRoutes);

app.use("/api/qrcode", qrcodeRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://dzubci00:Ki73085K@garmenjak.gd4oy.mongodb.net/garmenjakDB`
  )
  const User = require("./models/user"); // Putanja do tvoje User sheme

const updateUsersWithBirthDate = async () => {
  try {
    const result = await User.updateMany(
      { birthDate: { $exists: false } }, // Ažuriraj samo korisnike koji nemaju birthDate
      { $set: { birthDate: new Date("2000-01-01") } }
    );
    console.log(`✅ Ažurirano korisnika: ${result.modifiedCount}`);
  } catch (err) {
    console.error("❌ Greška prilikom ažuriranja korisnika:", err);
  }
};

// Pozovi funkciju nakon povezivanja na bazu
updateUsersWithBirthDate();
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
