const express = require('express')
const router = express.Router()
const multer = require('multer')
const Receipt = require('../models/receipts.js')
const User = require('../models/user.js')
const {personal, business} = require('../middle.js')

const upload = multer({ dest: 'public/images/' })
const defaultImage = '/images/noImageUploaded.png'


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
			storeName: "Home Depot",
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
			storeName: "Best Buy",
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
			res.redirect('/receipts/main')
		}
	})

})

router.get('', (req, res, next) => {

	let filters = req.query
	console.log(filters.storeName)
	if (!filters.storeName){
		delete filters.storeName
		console.log(filters)
	}
	let currentUser=req.session.currentUser
	let nowUser=currentUser._id

	Receipt.find({...filters, user: `${nowUser}`}, (err, foundReceipts, next) => {
		res.render("index.ejs", {
			allReceipts: foundReceipts,
			currentUser: req.session.currentUser
		})
	})
	console.log(req.query)
	
})

router.get('/totalExpenses', (req, res) => {
	let currentUser=req.session.currentUser
	let nowUser=currentUser._id
	Receipt.find({user: `${nowUser}`}, (err, findReceipts) => {
		if (err) {
			console.log(err)
		} else {
			res.render('index.ejs', {
				allReceipts: findReceipts,
				currentUser: req.session.currentUser
			})
		}
	})
})

router.get('/new', (req, res) => {
	res.render('new.ejs', {currentUser: req.session.currentUser})
})

router.get('/main', (req, res) => {
	let currentUser=req.session.currentUser
	let nowUser=currentUser._id
	Receipt.find({user: `${nowUser}`}, (err, receiptTotals) => {
		// res.send(receiptTotals)
		// console.log(receiptTotals)
		res.render('main.ejs', {
			allReceipts: receiptTotals,
			currentUser: req.session.currentUser
		})
	})
})

router.get('/:id', (req, res) => {
	Receipt.findById(req.params.id, (err, findReceipt) => {
		res.render('show.ejs', {
			receipt: findReceipt,
			currentUser: req.session.currentUser
		})
	})
})

router.get('/:id/edit', (req, res) => {
	Receipt.findById(req.params.id, (err, editReceipt) => {
		res.render('edit.ejs', {
			receipt: editReceipt,
			currentUser: req.session.currentUser
		})
	})
})

router.post('', upload.single('image'), (req, res) => {
	console.log(req.file)
	if (req.file === undefined) {
		req.body.image = defaultImage
	} else {
		req.body.image = req.file.path.replace("public", '')
	}
	Receipt.create(req.body, (error, newReceipt) => {
		if (error) {
			console.log(error)
		} else {
			// let currentUser = req.session.currentUser
			// req.body.user=currentUser._id
			console.log(req.body)
			res.redirect('/receipts/main')
		}
	})
})

router.put('/:id', upload.single('image'),(req, res) => {
	if (req.file === undefined) {
		req.body.image = defaultImage
	} else {
		req.body.image = req.file.path.replace("public", '')
	}
	console.log(req.body)
	Receipt.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedReceipt) => {
		res.redirect(`/receipts/main`)
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
