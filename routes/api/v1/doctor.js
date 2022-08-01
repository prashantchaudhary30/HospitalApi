const express = require('express')
const router = express.Router()
const doctorController = require('../../../app/http/api/v1/controllers/doctor');


router.post('/register', doctorController().create); //route for registering a new doctor

// doctor login route
router.post('/login', doctorController().login);


module.exports = router;