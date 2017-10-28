var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Notifications = require('../models/notification');
var Verify = require('./verify');

var notificationRouter = express.Router();
notificationRouter.use(bodyParser.json());

notificationRouter.route('/')
    .get(function (req, res, next) {
        Notifications.find(req.query)
            .exec(function (err, notification) {
                if (err) next(err);
                res.json(notification);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        if (req.decoded._id) {
            req.body.user = req.decoded._id;
            Notifications.create(req.body, function (err, notification) {
                if (err) next(err);
                var id = notification._id;
                res.json({ "_id": id });
            });
        }
    });


notificationRouter.route('/:notificationId')
    .get(function (req, res, next) {
        Notifications.findById(req.params.notificationId)
            .exec(function (err, notification) {
                if (err) next(err);
                res.json(notification);
            });
    })

    .put(function (req, res, next) {
        Notifications.findByIdAndUpdate(req.params.notificationId, {
            $set: req.body
        }, {
                new: true
            }, function (err, notification) {
                if (err) next(err);
                res.json(notification);
            });
    })

    .delete(Verify.verifyAdmin, function (req, res, next) {
        Notifications.findByIdAndRemove(req.params.notificationId, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

module.exports = notificationRouter;