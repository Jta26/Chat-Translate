const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required:true
    },
    locale: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.findAfterByTimestamp = function(timestamp) {
    return this.find({ timestamp: { $gte: timestamp} }).sort({ timestamp: 1 });
};

const User = mongoose.model('User', userSchema);

module.exports = {
    model: User,
    schema: userSchema
}