const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
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

passport.use(new GitHubStrategy({
  clientID: keys.github.clientID,
  clientSecret: keys.github.clientSecret,
  callbackURL: '/auth/github/redirect',
}, (accessToken, refreshToken, profile, done) => {
  User.findOrCreate({
    githubId: profile.id,
  }, {
    name: profile.displayName,
  }, (err, user) => {
    if (err) {
      console.log(err);
    }
    return done(err, user);
  });
}));
