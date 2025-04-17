const { EmployerProfile } = require('../models');

exports.createEmployerProfile = async (req, res) => {
  try {
    const { company_name, website, industry, company_size, location, description } = req.body;

    const profile = await EmployerProfile.create({
      userId: req.user.id,
      company_name,
      website,
      industry,
      company_size,
      location,
      description
    });

    res.status(201).json({ message: 'Employer profile created', profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employer profile' });
  }
};

exports.getEmployerProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employer profile' });
  }
};
