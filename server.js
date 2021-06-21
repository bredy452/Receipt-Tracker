
require('dotenv').config()

const express = require('express')
const multer = require('multer')
const app = express()
const PORT = process.env.PORT
const session = require('express-session')
const mongoURI = process.env.MONGODBURI

const receiptControllers = require('./controllers/receipt')
const userControllers = require('./controllers/user')
const sessionsControllers= require ('./controllers/sessions')
// const userControllers = require('./controllers/user.js')
const mongoose = require('mongoose')
const methodOverride = require ('method-override')

// const fileStorageEngine = multer.diskStorage({
// 	destination: (req, file, cb) =>{
// 		cb(null, './images')
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + '-' + file.originalname)
// 	}
// })

const upload = multer({ dest: 'public/images/' })


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

app.use(session( {
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}))

app.use('/receipts', receiptControllers)
app.use('/users', userControllers)
app.use('/sessions', sessionsControllers)

// app.get('/', (req, res) => {
// 	res.redirect('/receipts/main')
// })

app.get('/', (req, res) => {
	res.render('home.ejs', {
		currentUser: req.session.currentUser
	})
})

app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})