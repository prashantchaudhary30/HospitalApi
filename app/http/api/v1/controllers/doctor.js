const jwt = require('jsonwebtoken'); //used to decode jwt token
const Doctor = require('../../../../models/doctor'); //Doctor model
const bcrypt = require('bcrypt')


function doctorController() {
    return {
        // create doctor 
        async create(req,res) {
            try {
                const {email,name,password} = req.body;
                // checking parameters
                if(typeof(email)=="undefined" || typeof(password)=="undefined" || typeof(name)=="undefined") {
            
                    return res.status(201).json({
                        message:'Paramter missing'
                    })
                }
                // if doctor already registered
                let doctor  = await Doctor.findOne({ email: req.body.email })
                if(doctor){
                    return res.status(409).json( {
                        message: 'Doctor already exists!'
                    });
                } else {
                    // bcrpyt for password
                    const hashPassword = await bcrypt.hash(password,10)

                    const doctor = new Doctor({
                        name:name,
                        email:email,
                        password:hashPassword
                    })

                    //creating a new doctor account
                    doctor.save().then((doctor)=>{
                        return res.status(200).json( {
                            message: 'Doctor created successfully!',
                            doctor: doctor
                        })
                    }).catch(err=> {
                        return res.status(500).json( {
                            message: 'Internal Server Error'
                        })
                    })   
                }

            } catch(err) {
                console.log(err)
                console.log('Internal server error!!');
                return res.status(500).json( {
                    message: 'Internal Server Error'
                })
            }
        },

        // doctor login
        async login(req,res) {
            try {
                const {email,password} = req.body;
                console.log(req.body)
                if(typeof(email)=="undefined" || typeof(password)=="undefined") {
            
                    return res.status(201).json({
                        message:'Paramter missing'
                    })
                }

                let doctor  = await Doctor.findOne({ email: email })
                if(doctor){
                    // matching password
                    const validate = await bcrypt.compare(password,doctor.password)
                    if(!validate){
                        return res.status(400).json("Wrong Credentials")
                    }
                } 

                return res.status(200).json({
                    message:'Login Successful',
                    doctor : doctor,
                    token: jwt.sign(doctor.toJSON(), 'PaOpZvKmDVqtVwaUWLBvia9X5qNMaSNp', { expiresIn: '7200000' })

                })

            } catch(err) {
                console.log(err)
                console.log('Internal server error!!');
                return res.status(500).json( {
                    message: 'Internal Server Error'
                })
            }
        }
    }
}

module.exports = doctorController;