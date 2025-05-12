const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

exports.parseResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } else if (ext === ".doc" || ext === ".docx") {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
  } else {
    throw new Error("Unsupported file format");
  }
};
