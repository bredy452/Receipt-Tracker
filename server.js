
require('dotenv').config()

const express = require('express')
const multer = require('multer')
const app = express()
const PORT = process.env.PORT
const mongoURI = process.env.MONGODBURI


const receiptControllers = require('./controllers/receipt.js')
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
app.use('/receipts', receiptControllers)
// app.use('/users', userControllers)

// app.locals.type1 = 'business'

app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})