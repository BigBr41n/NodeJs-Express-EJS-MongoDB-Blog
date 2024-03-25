//imports
require('dotenv').config();
const express = require('express'); 
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo') ; 
const method_override = require('method-override');
const session = require('express-session');




//layouts
const expressLayout = require('express-ejs-layouts'); 




//setup the route and the port 
const app = express(); 
const PORT = process.env.PORT || 4000 ; 


//require the config file of the database 
const connectDB = require('./server/config/db');
//connect to dataBase 
connectDB(); 





//midllewars
app.use(express.urlencoded({extended : true})); 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(method_override('_method')); 




//session configs
app.use(session({
    secret : 'secret' ,
    resave : false , 
    saveUninitialized : true , 
    store : mongoStore.create({
        mongoUrl : process.env.DB_URI
    }),
}));




//static dir 
app.use(express.static('public')); 





//layout
app.use(expressLayout); 
app.set('layout' , './layouts/main'); 




//ejs view engine
app.set('view engine' , 'ejs'); 






//routes --admin and main
app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));





//port listenner 
app.listen(PORT , ()=>{
    console.log(`listen on  : ${PORT}`); 
})