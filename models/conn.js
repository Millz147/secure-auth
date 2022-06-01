//Modules
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

//DB Connection
mongoose.connect(process.env.DB)

//Check DB Connection
mongoose.connection
.on('error', () =>{
    console.log('user not connected')
})
.once('connected', () =>{
    console.log('Database Connected')
})