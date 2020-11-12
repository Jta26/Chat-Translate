const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('../models/user');
const messageSchema = new Schema({
    author: {type: user.schema},
    timestamp: Date,
    translations: {
        english: String,
        //add extra translations
    }
});

messageSchema.statics.findAfterByTimestamp = function(timestamp) {
    return this.find({ timestamp: { $gte: timestamp} }).sort({ timestamp: 1 });
};



const Message = mongoose.model('Message', messageSchema);