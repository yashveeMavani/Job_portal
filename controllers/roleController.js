const { Role } = require('../models');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};
