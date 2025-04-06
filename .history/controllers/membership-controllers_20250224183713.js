const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const updateMembershipStatus = async (req, res, next) => {
    try {
      const { userIds } = req.body; // Lista ID-eva korisnika koji su platili za sudca
  
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
  
      // Ažuriranje membershipPaid za odabrane korisnike
      await User.updateMany(
        { _id: { $in: userIds } }, 
        { $set: { membershipPaid: true } }
      );
  
      res.status(200).json({ message: "Membership status updated successfully" });
    } catch (err) {
      return next(new HttpError("Something went wrong. Try again later.", 500));
    }
  };
  
  const getUnpaidPlayers = async (req, res, next) => {
    console.time("DB Query");
const unpaidPlayers = await User.find({ membershipPaid: false })
  .select("name surname email")
  .lean();
console.timeEnd("DB Query");
  };

  const updateRefereeMembershipStatus = async (req, res, next) => {
    try {
      const { userIds } = req.body; // Lista ID-eva korisnika koji su platili članarinu
  
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
  
      // Ažuriranje membershipPaid za odabrane korisnike
      await User.updateMany(
        { _id: { $in: userIds } }, 
        { $set: { refereeMembershipPaid: true } }
      );
  
      res.status(200).json({ message: "Referee Membership status updated successfully" });
    } catch (err) {
      return next(new HttpError("Something went wrong. Try again later.", 500));
    }
  };

  const getUnpaidRefereePlayers = async (req, res, next) => {
    try {
      const unpaidPlayers = await User.find({ refereeMembershipPaid: false })
        .select("name surname email");
  
      res.status(200).json({ players: unpaidPlayers });
    } catch (err) {
      return next(new HttpError("Something went wrong. Try again later.", 500));
    }
  };

  exports.updateMembershipStatus = updateMembershipStatus;
  exports.getUnpaidPlayers = getUnpaidPlayers;
  exports.updateRefereeMembershipStatus=updateRefereeMembershipStatus;
  exports.getUnpaidRefereePlayers = getUnpaidRefereePlayers;
  