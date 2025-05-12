const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.generateOfferLetter = (data, filePath) => {
  const { name, position, company, startDate, salary } = data;

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Offer Letter", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Dear ${name},`);
  doc.moveDown();
  doc.text(
    `We are pleased to offer you the position of ${position} at ${company}.`
  );
  doc.text(`Start Date: ${startDate}`);
  doc.text(`Salary: ${salary}`);
  doc.moveDown();
  doc.text("We look forward to working with you.");
  doc.moveDown();
  doc.text("Sincerely,");
  doc.end();
};

exports.generateJobSummary = (data, filePath) => {
  const { jobTitle, totalApplications, topSkills } = data;

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Job Summary", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Job Title: ${jobTitle}`);
  doc.text(`Total Applications: ${totalApplications}`);
  doc.text(`Top Skills: ${topSkills.join(", ")}`);
  doc.end();
};
