require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT
const Receipt = require('./models/receipts.js')
const User = require('./models/user.js')
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

app.get('/seed', (req, res) => {
	Receipt.create([
		{
			storeName: "Lowes",
			date: "03/16/2021",
			type: "personal",
			amount: 50.00,
			description: "bought some food"

		},
		{
			storeName: "HomeDepot",
			date: "02/16/2021",
			type: "business",
			amount: 100.00,
			description: "bought some food"
		},
		{
			storeName: "BestBuy",
			date: "01/16/2021",
			type: "personal",
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

app.get('/receipts/new', (req, res) => {
	res.render('new.ejs')
})




app.listen(PORT, () => {
	console.log('Receipt App of the future!!!')
})