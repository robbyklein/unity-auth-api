// Env variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// Dependencies
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import usersController from './controllers/usersController'
import authController from './controllers/authController'

// Create app
const app = express()

// Configure app
app.use(cors())
app.use(bodyParser.json())

// Routing
app.post('/users', usersController.create)
app.post('/login', authController.login)
app.post('/validate', authController.validate)

// Start
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})
