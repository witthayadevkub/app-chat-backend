const express = require('express');
const { getUser, current_user, users } = require("../controllers/user.controller")
const { protectRoute } = require('../middleware/protectRoute')
const { auth } = require('../middleware/auth')
const router = express.Router()

router.post('/users',auth, getUser)

router.post('/users/current',auth, current_user)

router.get('/users',users)

module.exports = router;