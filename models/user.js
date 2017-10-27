const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt-nodejs');

// Define our model 
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// pre save hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isNew) { next(); } 

    // generate a salt then run call back
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err) }

        // hash (encrypt) password using the salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(er); }

            // store encrypted password
            user.password = hash;

            // save model
            next();
        })
    })
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {return callback(err) }
        callback(null, isMatch);
    })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// export model
module.exports = ModelClass;