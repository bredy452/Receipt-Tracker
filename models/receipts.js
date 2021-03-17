const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const receiptSchema = new Schema({
	type: {type: String, enum: ["personal", "Business"]},
	date: {type: Date, required: true},
	store: String,
	amount: {type: Number, min: 1}
	description: String
})

const Receipt = model('Receipt', receiptSchema)

module.exports = Receipt