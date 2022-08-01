require('dotenv').config()
const express = require('express')
const app  = express()
const db  = require('./app/config/mongoose')


const PORT = process.env.PORT || 5500

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/', require('./routes/index'));


app.listen(PORT, (err)=>{
    if(err) {
        console.log(`error :: ${err}`)
    } else {
        console.log(`server running on :: ${PORT}`)
    }
})

