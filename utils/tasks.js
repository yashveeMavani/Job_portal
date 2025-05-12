const { User, Job, Application } = require("../models");
const { JobSeekerProfile } = require("../models");
const { sendEmail } = require("./emailService");
const { Op } = require("sequelize");

async function sendReminderEmails() {
  console.log("Fetching users with incomplete profiles...");

  const incompleteProfiles = await JobSeekerProfile.findAll({
    where: { profileCompleted: false },
    include: [{ model: User, attributes: ["email"] }],
  });

  if (incompleteProfiles.length === 0) {
    console.log("No users with incomplete profiles found.");
    return;
  }

  for (const profile of incompleteProfiles) {
    const email = profile.User?.email;
    if (!email) {
      console.log(`No email found for profile ID: ${profile.id}`);
      continue;
    }

    console.log(`Sending email to ${email}`);
    await sendEmail(
      email,
      "Complete Your Profile",
      "Please complete your profile to get better job recommendations."
    );
  }
  console.log("Profile reminder emails sent.");
}

async function notifyExpiringJobs() {
  const expiringJobs = await Job.findAll({
    where: {
      expiryDate: {
        [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 3)),
      },
    },
  });

  for (const job of expiringJobs) {
    const applicants = await Application.findAll({
      where: { jobId: job.id },
      include: [{ model: User }],
    });
    for (const applicant of applicants) {
      await sendEmail(
        applicant.User.email,
        "Job Expiring Soon",
        `The job "${job.title}" is expiring soon. Apply now!`
      );
    }
  }
  console.log("Expiring job notifications sent.");
}

async function generateReports() {
  const totalUsers = await User.count();
  const totalJobs = await Job.count();
  const totalApplications = await Application.count();

  const report = `
    Weekly Report:
    - Total Users: ${totalUsers}
    - Total Jobs: ${totalJobs}
    - Total Applications: ${totalApplications}
  `;

  const adminEmails = ["yashveemavani@gmail.com"];
  for (const email of adminEmails) {
    await sendEmail(email, "Weekly Analytical Report", report);
  }
  console.log("Weekly analytical reports sent.");
}

module.exports = { sendReminderEmails, notifyExpiringJobs, generateReports };
