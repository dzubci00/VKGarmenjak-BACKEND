const cron = require("node-cron");
const Training = require("../models/training"); // ili putanja do modela treninga
// Funkcija za brisanje svih treninga
const deleteAllTrainings = async () => {
  try {
    await Training.deleteMany(); // briše sve treninge
    console.log("Svi treninzi su uspješno obrisani!");
  } catch (err) {
    console.error("Došlo je do greške pri brisanju treninga:", err);
  }
};
// Zakazivanje cron joba za zadnji dan u mjesecu u 23:00
cron.schedule(
  "0 23 28-31 * *",
  async () => {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // Provjera je li danas zadnji dan u mjesecu
    if (today.getDate() === lastDayOfMonth.getDate()) {
      console.log("Pokrećem brisanje treninga...");
      await deleteAllTrainings();
    } else {
      console.log("Danas nije zadnji dan u mjesecu, ništa se ne briše.");
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Belgrade", // Postavi timezone ako je potrebno
  }
);
