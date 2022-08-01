const express = require('express');
const passport = require('../../../app/config/passport');
const reportController = require('../../../app/http/api/v1/controllers/report');
const router = express.Router();

//route for getting all reports with a specific status with jwt auth
router.get('/:status', passport.authenticate('jwt', { session: false }), reportController.GetReports);

module.exports = router;