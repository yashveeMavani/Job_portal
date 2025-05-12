require("dotenv").config();
const express = require("express");
const { verifyToken } = require("./middleware/roleMiddleware");
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const cron = require("./utils/scheduler");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const secureRoutes = require("./routes/secureRoutes");
const roleRoutes = require("./routes/roleRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobSeekerProfileRoutes = require("./routes/jobSeekerProfileRoutes");
const employerProfileRoutes = require("./routes/employerProfileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const auditLogMiddleware = require("./middleware/auditLogMiddleware");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "qwertyuiop",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use(auditLogMiddleware);

app.use("/api/users", verifyToken, userRoutes);
app.use("/api/secure", verifyToken, secureRoutes);
app.use("/roles", verifyToken, roleRoutes);
app.use("/companies", verifyToken, companyRoutes);
app.use("/job-seeker-profile", verifyToken, jobSeekerProfileRoutes);
app.use("/api", verifyToken, employerProfileRoutes);
app.use("/api", verifyToken, jobRoutes);
app.use("/api", verifyToken, applicationRoutes);
app.use("/api/resumes", verifyToken, resumeRoutes);
app.use("/api/analytics", verifyToken, analyticsRoutes);
app.use("/api/admin", verifyToken, adminRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
