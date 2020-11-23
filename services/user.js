const User = require('../models/user');

const TranslationsMap = {
    en: 'English',
    es: 'Español',
    de: 'Deutsche',
    ar: 'العربية',
    ja: '日本語'
}

async function updateUserLanguage(user, language) {
    // let filter
    let update = {$set: {"locale": language}};
    return User.model.updateOne({"_id": user._id}, update).then( (resp) => {
        if (resp.nModified == 1) {
            return true
        }
        else {
            return false
        }
    }
    );
}

module.exports = {
    updateUserLanguage
}