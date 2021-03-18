require('dotenv').config()

const express = require('express')
const multer = require('multer')
const app = express()
const PORT = process.env.PORT
const mongoURI = process.env.MONGODBURI


const Receipt = require('./models/receipts.js')
const User = require('./models/user.js')
const mongoose = require('mongoose')
const methodOverride = require ('method-override')

const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, './images')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname)
	}
})

const upload =multer({storage: fileStorageEngine})









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

app.get('/seed', (req, res) => {
	Receipt.create([
		{
			type: "personal",
			storeName: "Lowes",
			date: "2021/03/2016",
			amount: 50.00,
			description: "bought some food"

		},
		{
			type: "business",
			storeName: "HomeDepot",
			date: "2021/02/16",
			amount: 100.00,
			description: "bought some food"
		},
		{
			type: "personal",
			storeName: "BestBuy",
			date: "2021/01/16",
			amount: 25.00,
			description: "bought some food"
		}
	], (err, data) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/receipts')
		}
	})

})



app.get('/receipts', (req, res, next) => {
	Receipt.find({}, (err, findReceipts) => {
		res.render('index.ejs', {allReceipts: findReceipts })
		console.log(req.body)
	})
})

app.get('/receipts/new', (req, res) => {
	res.render('new.ejs')
})

app.get('/receipts/:id', (req, res) => {
	Receipt.findById(req.params.id, (err, findReceipt) => {
		res.render('show.ejs', {receipt: findReceipt})
	})
})

app.get('/receipts/:id/edit', (req, res) => {
	Receipt.findById(req.params.id, (err, editReceipt) => {
		res.render('edit.ejs', {receipt: editReceipt})
	})
})

app.post('/receipts', upload.single('image'), (req, res) => {
	Receipt.create(req.body, (error, newReceipt) => {
		if (error) {
			console.log(error)
		} else {
			console.log(req.body)
			res.redirect('/receipts')
		}
	})
})

app.put('/receipts/:id', (req, res) => {
	Receipt.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedReceipt) => {
		res.redirect(`/receipts/${req.params.id}`)
	})
})



app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})