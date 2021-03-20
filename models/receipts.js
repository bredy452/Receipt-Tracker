const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const receiptSchema = new Schema({
	type: String,
	storeName: String,
	month: {type: String, required: true},
	year: {type: Number, required: true, min: 2021},
	amount: {type: Number, required: true, min: 1},
	description: String,
	image: {type: String, date: Buffer},
	filePath: String
})

const Receipt = model('Receipt', receiptSchema)

module.exports = Receipt