const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/new', (req, res) => {
	res.render('users/new.ejs', {
		currentUser: req.session.currentUser})
})

router.post('/', (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
	User.create(req.body, (err, createdUser) => {
		if (err) {
			res.send(err)
		} else {
			res.redirect('/')
		}
	})
})

module.exports = router