const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const { sendVerificationEmail } = require("../util/email");
//const crypto = require('crypto'); // To generate random verification codes

const News = require('../models/news');

const getNews = async (req, res, next) => {
  let news;
  try {
    news = await News.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching news failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ news: news.map(article => article.toObject({ getters: true })) });
};


exports.getNews=getNews;
