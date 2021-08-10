const express = require('express');
const router = express.Router();
const controller = require('../controllers/User.controller');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');

router.get('/',[isAuth],controller.userGet);

router.put('/add-ticket',[isAuth],controller.userUpdateTickets);

module.exports = router;