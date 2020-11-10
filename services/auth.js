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
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, (req, email, password, done) => {
        User.findOne({email: email})
        .then(user => {
            if (!user) {
                let name = req.body.name;
                let locale = req.body.locale;
                if (name == null || locale == null) {
                    throw 'One or more values are missing';
                }
                // create new user, hash the password, and save it.
                const newUser = new User({ email, password, name, locale });
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
);

const requiresAuth = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next()
    }
    else {
        res.redirect('/auth/login');
    }
}

// if the user is authenticated already, then we forward them to the chat/dashboard.
const forwardOnAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/chat');
    }
    else {
        next();
    }
}

module.exports = {
    passport,
    requiresAuth,
    forwardOnAuth
};