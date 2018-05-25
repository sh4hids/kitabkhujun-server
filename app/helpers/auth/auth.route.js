const express = require('express');
const authController = require('./auth.controller');
const passport = require('passport');

const router = express.Router();

router.get('/login', authController.logIn);
router.get('/login/google', passport.authenticate('google', { scope: ['email profile'] }));
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/auth/login' }), authController.googleCallbackHandler);
router.get('/login/github', passport.authenticate('github', {
  scope: ['user:email'],
}));
router.get('/github/redirect', passport.authenticate('github', { failureRedirect: '/auth/login' }), authController.githubCallbackHandler);
router.get('/logout', authController.logOut);

module.exports = router;
