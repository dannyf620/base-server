var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var likeSchema = new Schema({
    collaborator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollaboratorService'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientservice'
    },
    like: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });
var likes = mongoose.model('Like', likeSchema);

module.exports = likes;