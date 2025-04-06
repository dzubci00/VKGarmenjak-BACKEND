const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');


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


const crateArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input. Double-check your details and try again!', 422));
  }
  
  const { name, surname, role, position, membershipType } = req.body;

}


exports.getNews=getNews;
exports.crateArticle=crateArticle;
