const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const receiptSchema = new Schema({
	storeName: String,
	date: {type: String, required: true},
	type: {type: String, enum: ["personal", "Business"]},
	amount: {type: Number, min: 1},
	description: String
})

const Receipt = model('Receipt', receiptSchema)

module.exports = Receipt