var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: "35d"
  });
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or params
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      } else {
        req.decoded = decoded;
        var flag = req.decoded.admin;
        console.log(decoded);
        console.log("the flag is " + flag + "  only 'true' can do Post & Delete ");

        next();
      }
    });
  } else {
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }


};

exports.verifyAdmin = function (req, res, next) {
  if (!req.decoded) {
    var err = new Error('You are not authorized to perform the');
    err.status = 403;
    return next(err);
  } else {
    var id = req.decoded._id

    if (!req.decoded.admin) {
      var err = new Error('You are not authorized to perform provide');
      err.status = 403;
      return next(err);
    } else

      next();
  }

};

exports.verifyEngineer = function (req, res, next) {
  if (!req.decoded) {
    var err = new Error('No es un usuario, porfavor Registrese');

    //not admin pass error to next middleware
    err.status = 403;
    return next(err);
  } else {
    var id = req.decoded._id
    if (!req.decoded.userType.includes("Engineer")) {
      var err = new Error('No esta autorizado para realizar esta acción');
      err.status = 403;
      return next(err);
    } else

      next();
  }

};