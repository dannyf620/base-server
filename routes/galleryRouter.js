var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Galleries = require('../models/gallery');
var Verify = require('./verify');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var del = require('del');

var galleryRouter = express.Router();
galleryRouter.use(bodyParser.json());
var UPLOAD_PATH = 'uploads';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage });

galleryRouter.route('/images')
    .get(function (req, res, next) {
        Galleries.find({}, '-__v').lean().exec(function (err, images) {
            if (err) {
                return res.sendStatus(400);
            }
            for (var i = 0; i < images.length; i++) {
                var img = images[i];
                img.url = req.protocol + '://' + req.get('host') + '/galleries/images/' + img._id;
            }
            res.json(images);
        });
    })
    //.post(function (req, res, next) {
    .post(upload.single('image'), function (req, res, next) {

        console.log(req.body);
        console.log(req.file);
        console.log(req.params);
        var newImage = new Galleries();
        newImage.filename = req.file.filename;
        newImage.originName = req.file.originalname;
        newImage.description = req.body.description;
        newImage.mimetype = req.file.mimetype;
        newImage.save(function (err) {
            if (err) {
                return res.sendStatus(400);
            }
            res.status(201).json(newImage);
        })
    });
galleryRouter.route('/images/:id')
    .get(function (req, res, next) {
        var imgId = req.params.id;
        Galleries.findById(imgId, function (err, image) {
            if (err) {
                return next(err);
            }
            if (!image) {
                return res.status(401).json({
                    err: "No existe la ruta"
                });
            }
            res.setHeader('Content-type', image["mimetype"]);
            fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
        })
    })
    .delete(function (req, res, next) {
        var imgId = req.params.id;
        Galleries.findByIdAndRemove(imgId, function (err, image) {
            if (err) {
                next(err);
            }
            del([path.join(UPLOAD_PATH, image.filename)]).then(function (deleted) {
                res.sendStatus(200);
            });
        })
    });
galleryRouter.route('/')
    .get(function (req, res, next) {
        Galleries.find(req.query)
            .exec(function (err, gallery) {
                if (err) next(err);
                res.json(gallery);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        var gallery = req.body;
        if (req.decoded._id) {
            gallery.user = req.decoded._id;
            Galleries.create(gallery, function (err, gallery) {
                if (err) next(err);
                var id = gallery._id;
                res.json({ "_id": id });
            });
        }
    });


galleryRouter.route('/:galleryId')
    .get(function (req, res, next) {
        Galleries.findById(req.params.galleryId)
            .exec(function (err, gallery) {
                if (err) next(err);
                res.json(gallery);
            });
    })

    .put(function (req, res, next) {
        Galleries.findByIdAndUpdate(req.params.galleryId, {
            $set: req.body
        }, {
                new: true
            }, function (err, gallery) {
                if (err) next(err);
                res.json(gallery);
            });
    })

    .delete(Verify.verifyAdmin, function (req, res, next) {
        Galleries.findByIdAndRemove(req.params.galleryId, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

module.exports = galleryRouter;