const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// require auth helper
const requireAuth = passport.authenticate('jwt', { session: false });
// require signin helper
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
    // req - request
    // res - response to send back
    // next - error handling

    app.get('/', requireAuth, (req, res, next) => {
        res.send({ access: 'granted' });
    });
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);

}