const cron = require("node-cron");
const {
  sendReminderEmails,
  notifyExpiringJobs,
  generateReports,
} = require("./tasks");

console.log("Initializing cron jobs...");

cron.schedule("0 9 * * *", async () => {
  // cron.schedule('* * * * *', async () => {
  console.log("Running daily profile reminder job...");
  await sendReminderEmails();
});

cron.schedule("0 10 * * *", async () => {
  // cron.schedule('* * * * *', async () => {
  console.log("Running daily expiring job notification job...");
  await notifyExpiringJobs();
});

cron.schedule("0 8 * * 1", async () => {
  // cron.schedule('* * * * *', async () => {
  console.log("Running weekly report generation job...");
  await generateReports();
});

module.exports = cron;
