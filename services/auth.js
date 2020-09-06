const bcrypt = require('bcryptjs');
const User = require('../models/user').model;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email})
        .then(user => {
            if (!user) {
                // create new user, hash the password, and save it.
                const newUser = new User({ email, password, name: 'test', locale: 'en_US' });
                console.log('creating new user');
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => {
                            console.log(user);
                            return done(null, user);
                        })
                        .catch(err => {
                            return done(null, false, {message: err});
                        })
                    })
                })
            }
            else {
                // user exists, compare hashes of passwords, then log user in if correct.
                bcrypt.compare(password, user.password, (err, passwordsMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (passwordsMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: 'Email or Password Incorrect.'});
                    }
                })
            }
        })
    })
)

module.exports = passport;