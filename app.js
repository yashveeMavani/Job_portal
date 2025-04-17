require('dotenv').config();
const express = require('express');
const passport = require('passport');
require('./config/passport');   
const app = express();
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const secureRoutes = require('./routes/secureRoutes');
const roleRoutes = require('./routes/roleRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobSeekerProfileRoutes = require('./routes/jobSeekerProfileRoutes');
const employerProfileRoutes = require('./routes/employerProfileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');



app.use(express.json());
app.use(session({
    secret: 'qwertyuiop', 
    resave: false,
    saveUninitialized: false
  }));
  app.use(express.json());
app.use(passport.initialize()); 
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/secure', secureRoutes);
app.use('/roles', roleRoutes);
app.use('/companies', companyRoutes);
app.use('/job-seeker-profile', jobSeekerProfileRoutes);
app.use('/api', employerProfileRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);


app.listen(3000, () => console.log("Server running on port 3000"));
