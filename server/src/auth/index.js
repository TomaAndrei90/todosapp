const express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, joiValidate } = require('../models/User');

const { TOKEN_SECRET } = process.env;

const router = express.Router();

const createTokenSendResponse = (user, res, next) => {
  // this is used in login and signup routes to generate a token and respond with user + token
  try {
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '7d' });
    if (!token) throw Error('Invalid token.');

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

router.get('/', (req, res) => {
  res.json({
    message: 'auth get /',
  });
});

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const { error: joiValidateError } = joiValidate({ username, email, password });
    if (joiValidateError) {
      joiValidateError.message = joiValidateError.details[0].message;
      throw joiValidateError;
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) throw Error('User with this email already exists.');

    const newUser = new User({
      username,
      email,
      password: await bcrypt.hash(password, 12),
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Database could not save the new user.');

    createTokenSendResponse(savedUser, res, next);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { error: joiValidateError } = joiValidate({ email, password });
    if (joiValidateError) {
      joiValidateError.message = joiValidateError.details[0].message;
      throw joiValidateError;
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) throw Error('User with this email does not exist.');

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!passwordCorrect) throw Error('Incorrect password.');

    createTokenSendResponse(foundUser, res, next);
  } catch (error) {
    // ideally for login route it's safer to not have specific errors
    // but just a generic "throw Error('Unable to login')"
    // but for I will leave the error handling in this route as is
    next(error);
  }
});

module.exports = router;
