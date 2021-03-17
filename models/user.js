const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const userProfileSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, require: 'Email address is required'},
	username: {type: String, require: true, unique: true}
	password: {type: String, require: true}
})

const User = model('User', userProfileSchema)

module.exports = User