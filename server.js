const http = require('http'); 
require('dotenv').config(); 

const app = require('./index'); 



const PORT = process.env.PORT || 4000 ; 



const server = http.createServer(app);



server.listen(PORT , ()=>{
    console.log(`listen on  : ${PORT}`); 
});