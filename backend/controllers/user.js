const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

exports.createUser = (req, res, next) => {
  User.findOne({email: req.body.email}).then(user => {
    if (user) {
      res.status(422).json({
        message: 'User already exists!'
      });
    } else {
      bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
          const token = jwt.sign({email: result.email, userId: result._id}, jwtSecret, {expiresIn: '1h'});
          res.status(201).json({
            message: 'User created!',
            userId: result._id,
            access_token: token,
            expiresIn: 3600,
            email: result.email
          });
        })
        .catch(err => {
            res.status(500).json({
              message: 'Invalid authentication credentials!'
            });
        });
      });
    }
  }).catch(error => {
    res.status(500).json({error});
  });
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Invalid username or password'
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, jwtSecret, {expiresIn: '1h'});
    res.status(200).json({
      message: 'Login successful',
      access_token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      email: fetchedUser.email
    });
  }).catch(err => {
    return res.status(401).json({
      message: 'Invalid authentication credentials!'
    });
  });
};