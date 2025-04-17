const { Company } = require('../models');

exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company' });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};
