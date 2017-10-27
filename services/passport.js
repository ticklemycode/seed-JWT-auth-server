const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

/**
 * Local Strategy
 * used for signin when email and password is provided
 */ 
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // verify email and password then call done with user if correct
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // compare password - is 'password' equal to user.password?
        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (!isMatch) { return done(err, false); }

            return done(null, user);
        })
        
    });
});



/**
 * JWT Strategy
 * used when you want some resource restricted
 */
const jwtOptions = { 
    // where to find JWT
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// payload = decoded jwt token
// done = callback with error or user passed
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

    // if user id in payload exist in DB, call 'done' WITH user object
    // otherwise, call 'done' WITHOUT a user object
    User.findById(payload.sub, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);