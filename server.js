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

app.get('/receipts', (req, res, next) => {
	console.log(req.query.personalFilterType, "filtertype")
	console.log(req.query.store)
	console.log(req.query.year)
	console.log(req.query.month, "month")
	console.log(req.query.type)
	// req.params.month = req.query.month
	console.log(req.params)

	if (req.query.month) {
		req.params.month = req.query.month
		console.log(req.params.month, "months2")
		Receipt.find({month: req.params.month, type:'personal'}, (err, foundMonth) =>{
			console.log(foundMonth)
			
			return res.render('index.ejs', {
				allReceipts: foundMonth

			})
		})
} else if (req.query.store) {
		req.params.storeName = req.query.store
		console.log(req.params.storeName)
		Receipt.find({storeName: req.params.storeName, type:'personal'}, (err, foundStore) => {

			return res.render('index.ejs', {
				// Stores: foundStore,
				allReceipts: foundStore
			})
		})

	} else if (req.query.year) {
		req.params.year = req.query.year
		console.log(req.params.year)
		Receipt.find({year: req.params.year, type:'personal'}, (err, foundYear) => {

			return res.render('index.ejs', {
				Years: foundYear,
				allReceipts: foundYear
			})
		})

	} else if (req.query.personalFilterType==="month"){
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

		Receipt.find({}, (err, findReceipts) => {
		 return res.render('personalMonth.ejs', {
			allReceipts: findReceipts,
			allMonths: months
		})
	})
	}

	 // else if (req.query.month && (req.query.businessFilterType==="month")) {
	// 	req.params.month = req.query.month
	// 	console.log(req.params.month, "months2")
	// 	Receipt.find({type:'business'}, {month: req.params.month}, (err, foundMonth) =>{
	// 		console.log(foundMonth)
			
	// 		return res.render('index.ejs', {
	// 			thisMonth: foundMonth,
	// 			allReceipts: foundMonth

	// 		})
	// 	})

	// } 
	// else if (req.query.store && (req.query.businessFilterType==="store")) {
	// 	req.params.storeName = req.query.store
	// 	console.log(req.params.storeName)
	// 	Receipt.find({type:'business'}, {storeName: req.params.storeName}, (err, foundStore) => {

	// 		return res.render('index.ejs', {
	// 			Stores: foundStore,
	// 			allReceipts: foundStore
	// 		})
	// 	})

	// } 
	
	// else if (req.query.year && (req.query.businessFilterType==="year")) {
	// 	req.params.year = req.query.year
	// 	console.log(req.params.year)
	// 	Receipt.find({type:'business'}, {year: req.params.year}, (err, foundYear) => {

	// 		return res.render('index.ejs', {
	// 			Years: foundYear,
	// 			allReceipts: foundYear
	// 		})
	// 	})

	// } else
	 else if (req.query.businessFilterType==="month"){
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

		Receipt.find({}, (err, findReceipts) => {
		 return res.render('businessMonth.ejs', {
			allReceipts: findReceipts,
			allMonths: months
		})

	})

	} else if (req.query.personalFilterType==="year") {
		Receipt.find({type:'personal'}, (err, findYears) => {
		 res.render('year.ejs', {allYears: findYears})
		})

	} else if (req.query.businessFilterType==="year") {
		Receipt.find({type:'business'}, (err, findYears) => {
		 res.render('year.ejs', {allYears: findYears})
		})

	} else if (req.query.personalFilterType==="store") {
		Receipt.find({type:'personal'}, (err, findStores) => {
		 res.render('store.ejs', {allStores: findStores})
		})

	} else if (req.query.businessFilterType==="store") {
		Receipt.find({type:'business'}, (err, findStores) => {
		 res.render('store.ejs', {allStores: findStores})
		})

	} else if (req.query.personalFilterType==="all") { 
		Receipt.find({type:'personal'}, (err, findReceipts) => {
		res.render('index.ejs', {allReceipts: findReceipts})
		})

	} else if (req.query.businessFilterType==="all") { 
		Receipt.find({type:'business'}, (err, findReceipts) => {
		res.render('index.ejs', {allReceipts: findReceipts})
		})

	} else if (req.query.personalFilterType === undefined || req.query.businessFilterType === undefined) {
		Receipt.find({}, (err, findReceipts) => {
	 	res.render('index.ejs', {allReceipts: findReceipts})
		})

	} 
	// else if (req.query.businessFilterType === undefined) {
	// 	Receipt.find({}, (err, findReceipts) => {
	//  	res.render('index.ejs', {allReceipts: findReceipts})
	// 	})
	// }
})

app.get('/receipts/new', (req, res) => {
	res.render('new.ejs')
})

app.get('/receipts/main', (req, res) => {
	Receipt.find({}, (err, receiptTotals) => {
		res.render('main.ejs', {allReceipts: receiptTotals})
	})
})

app.get('/receipts/month', (req, res)=> {
	Re
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
			res.redirect('/receipts')
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
			res.redirect('/receipts')
		}
	})
})

app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})