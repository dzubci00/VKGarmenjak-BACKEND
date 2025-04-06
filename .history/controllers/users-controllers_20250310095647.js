const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const { sendVerificationEmail } = require("../util/email");
//const crypto = require('crypto'); // To generate random verification codes

const User = require('../models/user');
const UserToAdd = require('../models/userToAdd');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const addUser = async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input. Double-check your details and try again!', 422));
  }
  
  const { name, surname, role, position, membershipType } = req.body;
  

  try {
    // Check if user already exists (case-insensitive search)
    const existingUser = await UserToAdd.findOne({ name, surname })
      .collation({ locale: "hr", strength: 2 });

    if (existingUser) {
      return next(new HttpError('This user is already in the list!', 422));
    }

    const existingUserRegistered = await User.findOne({ name, surname })
      .collation({ locale: "hr", strength: 2 });

    if (existingUserRegistered) {
      return next(new HttpError('This user is already registered!', 422));
    }

    // Create and save new user
    const addedUser = new UserToAdd({ name, surname, role, position, membershipType, image: req.file.path});
    await addedUser.save();

    // Send success response
    res.status(201).json({ message: "User added successfully!", user: addedUser });

  } catch (err) {
    return next(new HttpError('Database error: Could not add user. Please try again later.', 500));
  }
};


const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input. Double-check your details and try again!', 422));
  }
  
  const { name, surname, email, password } = req.body;


  try {
    const existingUser = await User.findOne({ name, surname }).collation({ locale: "hr", strength: 2 });;
    if (existingUser) {
      return next(new HttpError('Looks like you already have an account. Just log in!', 422));
    }

    const userAddedByAdmin = await UserToAdd.findOne({ name, surname }).collation({ locale: "hr", strength: 2 });

    if (!userAddedByAdmin) {
      return next(new HttpError("You're not on the signup list. Check with the admin!", 422));
    }else{
      var membershipType=userAddedByAdmin.membershipType;
      var role=userAddedByAdmin.role;
      var position=userAddedByAdmin.position;
      var membershipPaid=userAddedByAdmin.membershipPaid;
      var matchesPlayed=userAddedByAdmin.matchesPlayed;
      var goals=userAddedByAdmin.goals;
      var assists=userAddedByAdmin.assists;
      var id=userAddedByAdmin.id;
      var image=userAddedByAdmin.image;
    }

    // Start a transaction session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    try {
      await userAddedByAdmin.deleteOne({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      await sess.abortTransaction();
      return next(new HttpError('Oops! Something went wrong. Try signing up again later.', 500));
    } finally {
      sess.endSession();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const createdUser = new User({
      id:id,
      name,
      surname,
      email,
      password: hashedPassword,
      role: role,
      position:position,
      membershipType: membershipType,
      membershipPaid:membershipPaid,
      matchesPlayed:matchesPlayed,
      goals:goals,
      assists:assists,
      image,
      isVerified: false, // New field to track if the user is verified
    });

    await createdUser.save();

    let isAdmin;
    if (role==='admin'){
      isAdmin=true;
    }else
    {
      isAdmin=false;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET || 'supersecret_dont_share',
      { expiresIn: '1h' }
    );

    // Send verification email
   // await sendVerificationEmail(email, token);

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token, isAdmin:isAdmin });
  } catch (err) {
    return next(new HttpError('Oops!1 Something went wrong. Try signing up again later.', 500));
  }
};


const login = async (req, res, next) => {
  const { email, password } = req.body;

  let isAdmin;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser.isVerified) {
    return next(new HttpError("Logging in failed, please verify your email first!", 403));
  }


  if (existingUser.role==='admin'){
    isAdmin=true;
  }else
  {
    isAdmin=false;
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    isAdmin: isAdmin,
  });
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret_dont_share");

    // Find the user by ID and update the isVerified field
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    return next(new HttpError("Invalid or expired token.", 400));
  }
};

const getPlayers = async (req, res, next) => {
  const positionOrder = ["Wing", "Driver", "Point", "Hole set", "Goalkeeper"]; // Definirani redoslijed pozicija

  let registeredPlayers = [];
  let unregisteredPlayers = [];
  let players = [];

  try {
    // Dohvati samo registrirane igrače koji imaju ulogu "player", bez lozinke
    registeredPlayers = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching registered players failed, please try again later.", 500));
  }

  try {
    // Dohvati neregistrirane igrače
    unregisteredPlayers = await UserToAdd.find({});
  } catch (err) {
    return next(new HttpError("Fetching unregistered players failed, please try again later.", 500));
  }

  // Spoji registrirane i neregistrirane igrače
  players = [...registeredPlayers, ...unregisteredPlayers];

  // Sortiraj prema `positionOrder`
  players.sort((a, b) => {
    return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
  });

  res.json({ players: players.map(player => player.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  let user;
  try {
    user = await User.find({userId}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json( user: user);
};

exports.getPlayers=getPlayers;
exports.addUser = addUser;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.verifyEmail = verifyEmail;
