const mongoose = require('mongoose'); //requiring mongoose
const db = mongoose.connection; //acquiring the connection

mongoose.connect((process.env.MONGODB_URL),{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected..');
}).on('error',(err) => {
    console.log(err);
});


module.exports = db;