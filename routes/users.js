var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

router.get('/', Verify.verifyOrdinaryUser, Verify.verifyEngineer, function (req, res, next) {
  User.find({}, function (err, user) {
    if (err) {
      return res.status(500).json({
        err: 'not enough privileges '
      });
    }
    res.json(user);
  });
});

router.post('/register', function (req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function (err, user) {
      console.log(req.body);
      if (err) {
        return res.status(500).json({ err: err });
      }
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.phone) {
        user.phone = req.body.phone;
      }
      if (req.body.userType == "User" || req.body.userType == "Collaborator") {
        user.userType = req.body.userType
      }
      if (req.body.pswIndex) {
        user.pswIndex = req.body.pswIndex;
      }
      console.log(user);
      user.save(function (err, newuser) {
        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({ status: 'Registration Successful!' });
        });
      });
    });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      var token = Verify.getToken({ "username": user.username, "_id": user._id, "userType": user.userType });
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        userType:user.userType
      });
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'ya!'
  });
});

router.get('/facebook', passport.authenticate('facebook'),
  function (req, res) { });

router.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        username: user.username,
        token: token
      });
    });
  })(req, res, next);
});
router.post('/emailResponse', function (req, res, next) {
  User.findOne({ email: req.body.email }, function (error, user) {
    console.log("Parametros de entrada");
    console.log(req.body);
    console.log("Datos de salida");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        err: 'Usuario no encontrado'
      });
    } else {
      //envio de correo 
      res.json({ "Id": user._id });
    }
  });
});

module.exports = router;