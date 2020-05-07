/* eslint-disable newline-per-chained-call */
const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
});

const joiValidate = (user) => {
  // there must be a better way to write this with Joi, instead of defining separate schemas
  const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(5).max(30).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().trim().min(10).max(255).required(),
  });

  const schemaWithoutUsername = Joi.object().keys({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().trim().min(10).max(255).required(),
  });

  return Joi.validate(user, user.hasOwnProperty('username') ? schema : schemaWithoutUsername);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User, joiValidate };
