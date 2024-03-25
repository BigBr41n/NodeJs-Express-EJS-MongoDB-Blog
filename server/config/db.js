const mongoose = require('mongoose'); 
require('dotenv').config(); 



//local db 
const connectDB = ()=>{
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.DB_URI); 
        const db = mongoose.connection ; 
        db.on('error' , ()=> console.log("db connectio fail")); 
        db.once('open' , ()=> console.log("db connected"));
    } catch (error) {
        console.log(error); 
    }
}


module.exports = connectDB ; 