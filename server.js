require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const methodOverride = require ('method-override')
const mongoURI = process.env.MONGODBURI
const db = mongoose.connection

mongoose.connect(mongoURI, {
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
}, () => {
	console.log('database connection checked')
})

db.on('error', (err) => { console.log('ERROR: ', err)})
db.on('connected', (err) => { console.log('mongo connected')})
db.on('disconnected', (err) => { console.log('mongo disconnected')})

app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))






app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})