const express = require('express')
const router = express.Router()
const patientController = require('../../../app/http/api/v1/controllers/patient')
const passport = require('../../../app/config/passport');

//route for registering a new patient
router.post('/register',passport.authenticate('jwt', { session: false }), patientController.create); 

 //rotue for new report
router.post('/:id/create_report',passport.authenticate('jwt', { session: false }) ,patientController.create_report);

//route for all reports
router.get('/:id/all_reports', passport.authenticate('jwt', { session: false }), patientController.all_reports); 


module.exports = router;