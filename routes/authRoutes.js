const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/roleMiddleware');
const { login, requestOTP, verifyOTP } = require('../controllers/authController');

// JWT Auth
router.post('/login', login);
router.post('/request-otp', verifyToken, requestOTP);
router.post('/verify-otp', verifyToken, verifyOTP);

// Google OAuth2
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);
router.get('/linkedin',
    passport.authenticate('linkedin', {
      scope: ['r_liteprofile', 'r_emailaddress'],
      session: false
    })
  );

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      message: 'Google login successful',
      user: req.user,
      token
    });
  }
);

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.json({
        message: 'LinkedIn login successful',
        user: req.user,
        token
      });
    }
  );
  
  module.exports = router;
