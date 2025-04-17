const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { User } = require('../models');

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
         
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);


passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL:  process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_liteprofile', 'r_emailaddress'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: email,
          role: 'job_seeker' 
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));



passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});
