const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const listRoutes = require('./routes/routes'); 
const usersRoutes = require('./routes/users'); 
const app = express();
// todo
// remove retryWrites=true
mongoose.connect("mongodb+srv://bapansujatadas:" +
process.env.MONGO_ATLAS_PW  +
"@cluster0.s9spoxe.mongodb.net/node-angular?w=majority")
.then(()=>{
    console.log('Connected to database');
}).catch(()=>{
    console.log('Connection is failed');
});
  
// iyMqY2Zb6LUHIgS6



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

app.use('/api/lists', listRoutes);
app.use('/api/user', usersRoutes);


module.exports = app;