const express = require('express')
const router = express.Router()
const multer = require('multer')
const Receipt = require('../models/receipts.js')
const {personal, business} = require('../middle.js')

const upload = multer({ dest: 'public/images/' })
// router.locals.type2 = 'business'




router.get('/seed', (req, res) => {
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
			storeName: "routerlebees",
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
router.get('', (req, res, next) => {
	console.log(Object.keys(req.query).length)
	console.log(req.query)
	
	// console.log(req.query)

	let filters = req.query
	
	console.log(filters.month)
Receipt.find({...filters}, (err, foundReceipts, next) => {
				res.render("index.ejs", {allReceipts: foundReceipts
				})

			})
		// if() {//receipts/main (personal/business)
		// 	//set type (personal/business)
			
		// } else {
		// //when user chooses a month
		// 	//console.log that we are here
		// }
	
	})

router.get('/totalExpenses', (req, res) => {
	Receipt.find({}, (err, findReceipts) => {
		res.render('index.ejs', {allReceipts: findReceipts})
		})
})

router.get('/new', (req, res) => {
	res.render('new.ejs')
})

router.get('/main', (req, res) => {
	Receipt.find({}, (err, receiptTotals) => {
		res.render('main.ejs', {allReceipts: receiptTotals})
	})
})

router.get('/:id', (req, res) => {
	Receipt.findById(req.params.id, (err, findReceipt) => {
		res.render('show.ejs', {receipt: findReceipt})
	})
})

router.get('/:id/edit', (req, res) => {
	Receipt.findById(req.params.id, (err, editReceipt) => {
		res.render('edit.ejs', {receipt: editReceipt})
	})
})

router.post('', upload.single('image'), (req, res) => {
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

router.put('/:id', upload.single('image'),(req, res) => {
	req.body.image = req.file.path.replace("public", '')
	console.log(req.body)
	Receipt.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedReceipt) => {
		res.redirect(`/receipts/${req.params.id}`)

	})
})

router.delete('/:id', (req, res) => {
	Receipt.findByIdAndRemove(req.params.id, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/receipts/main')
		}
	})
})

module.exports = router
