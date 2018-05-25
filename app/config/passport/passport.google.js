const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../keys');
const { User } = require('../../components/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: '/auth/google/redirect',
}, (accessToken, refreshToken, profile, done) => {
  User.findOrCreate({
    googleId: profile.id,
    email: profile.emails[0].value,
  }, {
    name: profile.displayName,
  }, (err, user) => {
    if (err) {
      console.log(err);
    }
    return done(err, user);
  });
}));
