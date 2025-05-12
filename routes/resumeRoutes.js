const express = require("express");
const multer = require("multer");
const nlp = require("compromise");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const uploadDir = "uploads/resumes/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    fs.unlinkSync(filePath);

    const parsedData = await pdfParse(dataBuffer);

    const extractedData = {
      text: parsedData.text,
      skills: extractSkills(parsedData.text),
      experience: extractExperience(parsedData.text),
    };

    res.json({ message: "Resume parsed successfully", extractedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

function extractSkills(text) {
  const predefinedSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "SQL",
    "HTML",
    "CSS",
    "AWS",
    "Docker",
    "Kubernetes",
  ];

  const doc = nlp(text);
  const words = doc.terms().out("array");

  return predefinedSkills.filter((skill) => words.includes(skill));
}

function extractExperience(text) {
  const experienceRegex = /\b(\d+)\s+(years|year)\s+(of\s+)?experience\b/gi;
  const matches = [];
  let match;

  while ((match = experienceRegex.exec(text)) !== null) {
    matches.push(`${match[1]} years of experience`);
  }

  return matches;
}

module.exports = router;
