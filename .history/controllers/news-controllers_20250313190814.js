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
  
  const { title, content } = req.body;

  try {
     
      const addedArticle = new News({ title, content, image: req.file.path});
      await addedUser.save();
  
      // Send success response
      res.status(201).json({ message: "Article added successfully!", article: addedArticle });
  
    } catch (err) {
      return next(new HttpError('Database error: Could not add user. Please try again later.', 500));
    }

}


exports.getNews=getNews;
exports.crateArticle=crateArticle;
