const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

const { verifyToken, checkRole } = require('../middleware/roleMiddleware');

router.post('/', verifyToken, checkRole(['admin']), companyController.createCompany);
router.get('/', verifyToken, checkRole(['admin']), companyController.getAllCompanies);

module.exports = router;
