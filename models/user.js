var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    OauthId: String,
    OauthToken: String,
    resetPasswordExpires: Date,
    firstname: {
        type: String,
        default: ''
    },
    userState: {
        type: Number,
        default: 0
    },
    phone: {
        type: String,
        required: false
    },
    pswIndex: {
        type: String,
        required: false
    },
    dateLastSing: {
        type: Date,
        required: false,
        default: Date.now
    },
    dateLastChangePsw: {
        type: Date
    },
    userType: {
        type: String,
        enum: ['User', 'Collaborator', 'Admin', 'Engineer'],
        default: 'User'
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: false
    }
});

User.methods.getName = function () {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);