const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

class SocialAuth {
  static init(app) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ 'socialLogins.googleId': profile.id });

        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: await PasswordUtil.generateTemporaryPassword(),
            socialLogins: {
              googleId: profile.id
            },
            role: 'customer'
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));

    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ 'socialLogins.facebookId': profile.id });

        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: await PasswordUtil.generateTemporaryPassword(),
            socialLogins: {
              facebookId: profile.id
            },
            role: 'customer'
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));

    app.use(passport.initialize());
  }

  static googleAuth() {
    return passport.authenticate('google', {
      scope: ['profile', 'email']
    });
  }

  static facebookAuth() {
    return passport.authenticate('facebook', {
      scope: ['email']
    });
  }

  static handleCallback(strategy) {
    return passport.authenticate(strategy, {
      failureRedirect: '/login',
      session: false
    });
  }
}

module.exports = SocialAuth;