const jwt = require('jsonwebtoken');
const Doctor = require('../../../../models/doctor'); //Doctor model
const Patient = require('../../../../models/patient.js');
const Report = require('../../../../models/report.js');

// create patient 
module.exports.create = async  (req, res) => {

    const doctorJWTToken = req.headers.authorization;
    const token = doctorJWTToken.split(' ');
    const decoded = jwt.verify(token[1], 'PaOpZvKmDVqtVwaUWLBvia9X5qNMaSNp');

    try {
        const doctor = await Doctor.findById(decoded._id); //finding the doctor
        if (!doctor) {
            return res.status(400).json({
                message: 'Doctor not exists'
            })
        } else {

            const { name, phone, sex, age, comorbidity } = req.body;
            
            if (phone) { //if patient is alreay registered 
                const patient = await Patient.findOne({ phone: req.body.phone })
                if (patient) {
                    return res.status(200).json({
                        patient: patient
                    })
                }
            }
            // checking all parameter 
            if (!phone || !name || !sex || !age || typeof (comorbidity) == "undefined") {
                return res.status(201).json({
                    message: 'Parameter missing'
                })
            }

            // creater patient with doctor id : relation(one to many) one doctor can have many patients
            const patient = new Patient({
                name: name,
                phone: phone,
                sex: sex,
                age: age,
                comorbidity: comorbidity,
                doctorId: doctor._id
            })

            patient.save().then((patient) => {
                return res.status(200).json({
                    message: 'Patient registered successfully!',
                    patient: patient
                })
            }).catch(err => {
                return res.status(500).json({
                    message: 'Internal Server Error'
                })
            })
        }


    } catch (err) {
        console.log('Internal server error!!');
        console.log(err)
        return res.json(500, {
            message: 'Internal Server Error'
        })
    }

}

// create report for patient
module.exports.create_report = async  (req, res) => {

    const doctorJWTToken = req.headers.authorization;
    const token = doctorJWTToken.split(' ');
    const decoded = jwt.verify(token[1], 'PaOpZvKmDVqtVwaUWLBvia9X5qNMaSNp');

    try {
        const doctor = await Doctor.findById(decoded._id); //finding the doctor
        if (!doctor) {
            //if doctor dosen't exist
            return res.json(401, {
                message: 'Doctor does not exist in database!'
            })
        } else {
            let patient = await Patient.findById(req.params.id); //finding the patient
            if (patient) {
                //if patient exists create his/her report
                let report = await Report.create({
                    doctor: decoded._id,
                    patient: patient._id,
                    status: req.body.status
                });
                return res.status(200).json({
                    message: 'Report created successfully',
                    data: report
                })
            } else {
                //if patient dosen't exist
                return res.json(401, {
                    message: 'Patient dosen\'t exist in database',
                });
            }
        }
    } catch {
        //checking for errors
        console.log('Internal server error!!');
        return res.json(500, {
            message: 'Internal Server Error'
        })
    }

}

// Get all reports 
module.exports.all_reports = async(req,res) => {

    const doctorJWTToken = req.headers.authorization;
    const token = doctorJWTToken.split(' ');
    const decoded = jwt.verify(token[1], 'PaOpZvKmDVqtVwaUWLBvia9X5qNMaSNp');

    try {
        const doctor = await Doctor.findById(decoded._id); //finding the doctor
        if (!doctor) {
            //if doctor dosen't exist
            return res.json(401, {
                message: 'Doctor does not exist in database!'
            })
        } else {
            let patient = await Patient.findById(req.params.id); //finding the patient
            if (patient) {
                //if patient exists
                let reports = await Report.find({ patient: patient._id }).sort({ date: -1 }); //fetching all reports of a patient
                return res.json(201, {
                    message: 'Reports fetched successfully',
                    data: reports
                })
            } else {
                //if patient dosen't exist
                return res.json(401, {
                    message: 'Patient dosen\'t exist in database',
                });
            }
        }
    } catch {
        //checking for errors
        console.log('Internal server error!!');
        return res.json(500, {
            message: 'Internal Server Error'
        })
    }

}
