const express = require('express');
const router = express.Router();
const { checkout,payForOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
router.post('/checkout', protect, checkout);
router.post('/:id/pay', protect, payForOrder);
module.exports = router;
