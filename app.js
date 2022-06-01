//Modules
const express = require('express')
const app = express()
const morgan = require('morgan')
const router = require('./routes/index')


const PORT = process.env.PORT || 3000

app.use(morgan('tiny'))
//Main ROuter
app.use('/', router)

app.listen(PORT)


//Thanks for Cloning My Secure Auth API. You can reach out to me on my Mail "habibsibrahim@gmail.com"