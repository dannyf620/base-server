var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Likes = require('../models/like');
var Verify = require('./verify');

var likeRouter = express.Router();
likeRouter.use(bodyParser.json());

likeRouter.route('/')
    .get(function (req, res, next) {
        Likes.find(req.query)
            .exec(function (err, like) {
                if (err) next(err);
                res.json(like);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        if (req.decoded._id) {
            req.body.user = req.decoded._id;
            Likes.create(req.body, function (err, like) {
                if (err) next(err);
                var id = like._id;
                res.json({ "_id": id });
            });
        }
    });


likeRouter.route('/:likeId')
    .get(function (req, res, next) {
        Likes.findById(req.params.likeId)
            .exec(function (err, like) {
                if (err) next(err);
                res.json(like);
            });
    })

    .put(function (req, res, next) {
        Likes.findByIdAndUpdate(req.params.likeId, {
            $set: req.body
        }, {
                new: true
            }, function (err, like) {
                if (err) next(err);
                res.json(like);
            });
    })

    .delete(Verify.verifyAdmin, function (req, res, next) {
        Likes.findByIdAndRemove(req.params.likeId, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

module.exports = likeRouter;