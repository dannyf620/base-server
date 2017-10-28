// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
    },
    send: {
        type: Date,
        default: new Date()
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    modifiedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// the schema is useless so far
// we need to create a model using it
var Notifications = mongoose.model('Notification', notificationSchema);

// make this available to our Node applications
module.exports = Notifications;