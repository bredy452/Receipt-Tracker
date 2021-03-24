
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

app.locals.type1 = 'personal'
// app.locals.type2 = 'business'

app.get('/seed', (req, res) => {
	Receipt.create([
		{
			type: "personal",
			storeName: "Lowes",
			month: "March",
			year: 2021,
			amount: 50.00,
			description: "bought some food",
			image: "https://1000logos.net/wp-content/uploads/2017/05/Pepsi-Logo.png"

		},
		{
			type: "business",
			storeName: "HomeDepot",
			month: "February",
			year: 2021,
			amount: 100.00,
			description: "bought some food",
			image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"
		},
		{
			type: "personal",
			storeName: "Applebees",
			month: "February",
			year: 2021,
			amount: 100.00,
			description: "bought some food",
			image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"
		},
		{
			type: "personal",
			storeName: "BestBuy",
			month: "January",
			year: 2021,
			amount: 25.00,
			description: "bought some food",
			image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/19/Dr_Pepper_modern.svg/1200px-Dr_Pepper_modern.svg.png"
		}
	], (err, data) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/receipts')
		}
	})

})


//personal filtering
app.get('/receipts', (req, res, next) => {
	console.log(req.query.personalFilter, "filtertype")
	console.log(req.query)

		if (req.query.personalFilter==='month'){
			// Receipt.find({type: 'personal'}, (err, foundReceipts) =>{
			// // console.log(foundMonth)
			// console.log(foundReceipts)
			app.locals.type1 = 'personal'
			res.render('personalMonth.ejs')
				// allMonths: foundReceipts

		} else if (req.query.businessFilter==='month'){
			// Receipt.find({type: 'personal'}, (err, foundReceipts) =>{
			// // console.log(foundMonth)
			// console.log(foundReceipts)
			app.locals.type1 = 'business'

			res.render('businessMonth.ejs')
				// allMonths: foundReceipts

		} else if (req.query.personalFilter==='store'){
			// Receipt.find({type: 'personal'}, (err, foundReceipts) =>{
			// // console.log(foundMonth)
			// console.log(foundReceipts)
			app.locals.type1 = 'personal'

			Receipt.find({type: 'personal'}, (err, foundReceipts, next) => {
				res.render("store.ejs", {allReceipts: foundReceipts})
			})

		} else if (req.query.businessFilter==='store'){
			// Receipt.find({type: 'personal'}, (err, foundReceipts) =>{
			// // console.log(foundMonth)
			// console.log(foundReceipts)
			app.locals.type1 = 'business'

			Receipt.find({type: 'business'}, (err, foundReceipts, next) => {
				res.render("store.ejs", {allReceipts: foundReceipts
				})
			})

		} else if (req.query.personalFilter==='year'){
			// Receipt.find({type: 'personal'}, (err, foundReceipts) =>{
			// // console.log(foundMonth)
			// console.log(foundReceipts)
			app.locals.type1 = 'personal'

			Receipt.find({type: 'personal'}, (err, foundReceipts, next) => {
				res.render("personalYear.ejs", {allReceipts: foundReceipts
				})
			})

		} else if (req.query.businessFilter==='year'){
			// Receipt.find({type: 'personal'}, (err, foundReceipts) =>{
			// // console.log(foundMonth)
			// console.log(foundReceipts)
			app.locals.type1 = 'business'

			Receipt.find({type: 'business'}, (err, foundReceipts, next) => {
				res.render("businessYear.ejs", {allReceipts: foundReceipts
				})
			})

		} else if (req.query.month && app.locals.type1==='personal'){

			Receipt.find({month: req.query.month, type: 'personal'}, (err, foundReceipts, next) => {
				res.render("index.ejs", {allReceipts: foundReceipts
				})
			})

		} else if (req.query.month && app.locals.type1==='business'){

			Receipt.find({month: req.query.month, type: 'business'}, (err, foundReceipts, next) => {
				res.render("index.ejs", {allReceipts: foundReceipts
				})
			})
		} else if (req.query.store && app.locals.type1==='personal') {

			Receipt.find({storeName: req.query.store, type: 'personal'}, (err, foundReceipts, next) => {
				res.render("index.ejs", {
					allReceipts: foundReceipts
				})
			})

		} else if (req.query.store && app.locals.type1==='business') {

			Receipt.find({storeName: req.query.store, type: 'business'}, (err, foundReceipts, next) => {
				res.render("index.ejs", {
					allReceipts: foundReceipts
				})
			})

		} else if (req.query.year && app.locals.type1==='personal') {

			Receipt.find({year: req.query.year, type: 'personal'}, (err, foundReceipts, next) => {
				res.render("index.ejs", {
					allReceipts: foundReceipts
				})
			})

		} else if (req.query.year && app.locals.type1==='business') {

			Receipt.find({year: req.query.year, type: 'business'}, (err, foundReceipts, next) => {
				res.render("index.ejs", {
					allReceipts: foundReceipts
				})
			})

		} else if (req.query.personalFilter==="all") { 
			Receipt.find({type:'personal'}, (err, findReceipts) => {
				res.render('index.ejs', {allReceipts: findReceipts
				})
			})
		} else if (req.query.businessFilter==="all") { 
			Receipt.find({type:'business'}, (err, findReceipts) => {
				res.render('index.ejs', {allReceipts: findReceipts
				})
			})
		}
		
})

app.get('/receipts/totalExpenses', (req, res) => {
	Receipt.find({}, (err, findReceipts) => {
		res.render('index.ejs', {allReceipts: findReceipts})
		})
})

app.get('/receipts/new', (req, res) => {
	res.render('new.ejs')
})

app.get('/receipts/main', (req, res) => {
	Receipt.find({}, (err, receiptTotals) => {
		res.render('main.ejs', {allReceipts: receiptTotals})
	})
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
	req.body.image = req.file.path.replace("public", '')
	console.log(req.body)
	Receipt.create(req.body, (error, newReceipt) => {
		if (error) {
			console.log(error)
		} else {
			res.redirect('/receipts/main')
		}
	})
})

app.put('/receipts/:id', upload.single('image'),(req, res) => {
	req.body.image = req.file.path.replace("public", '')
	console.log(req.body)
	Receipt.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedReceipt) => {
		res.redirect(`/receipts/${req.params.id}`)

	})
})

app.delete('/receipts/:id', (req, res) => {
	Receipt.findByIdAndRemove(req.params.id, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/receipts/main')
		}
	})
})

app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})