const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const receiptSchema = new Schema({
	type: String,
	storeName: String,
	date: {type: String, required: true},
	amount: {type: Number, min: 1},
	description: String,
	image: {type: String, date: Buffer},
	filePath: String
})

const Receipt = model('Receipt', receiptSchema)

module.exports = Receipt