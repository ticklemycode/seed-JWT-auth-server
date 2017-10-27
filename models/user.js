const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt-nodejs');

//================================
// User Schema
//================================
const userSchema = new Schema({
    email: {
        type: String, 
        unique: true, 
        lowercase: true, required: true
    },
    password: {
        type: String, 
        required: true
    }
});

// pre save hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this,
    SALT_FACTOR = 10;

    if (!user.isNew) { next(); } 

    // generate a salt then run call back
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
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