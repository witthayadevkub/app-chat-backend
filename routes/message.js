const express = require('express');
const { sendMessage, getMessage, removeMessage } = require('../controllers/message.controller');
// const { protectRoute } = require('../middleware/protectRoute');
const { auth } = require('../middleware/auth');
const router = express.Router()

router.post("/message/:id", auth, getMessage);
router.post('/message/send/:id', auth, sendMessage)
router.delete('/message/:id', auth, removeMessage)
module.exports = router;