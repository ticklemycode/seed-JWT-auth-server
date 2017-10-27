const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

/**
 * tokenForUser
 * generate JWT for user
 * @param {User} user 
 * @returns {String} - jwt 
 */
tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp, email: user.email }, config.secret);
}


//========================================
// Signin Route - Authentication.signin
//========================================
exports.signin = (req, res, next) => {
    // user is already authorized just return token
    res.send({ token: tokenForUser(req.user) });
}


//========================================
// Signup Route - Authentication.signup
//========================================
exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // required fields
    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' });
    }

    // does user exist with email
    User.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }
        
        // else return error message
        if (existingUser) {
            return res.status(422).send({error: "Email is in use."})
        }

        // new email, create and save
        const user = new User({
            email,
            password
        });

        // save and respond with JWT
        user.save((err) => {
            if (err) { return next(err)}

            res.json({ token: tokenForUser(user) });
        });
    });
}