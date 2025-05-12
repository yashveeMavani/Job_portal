const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

exports.exportToCSV = (data, fields) => {
  const json2csvParser = new Parser({ fields });
  return json2csvParser.parse(data);
};

exports.exportToExcel = async (data, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length + 2);
    });
    column.width = maxLength;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
