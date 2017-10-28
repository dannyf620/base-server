var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gallerySchema = new Schema({
    name: String,
    filename: String,
    description: String,
    containerId: String,
    originalName: String,
    mimetype: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });
var gallery = mongoose.model('Gallery', gallerySchema);

module.exports = gallery;