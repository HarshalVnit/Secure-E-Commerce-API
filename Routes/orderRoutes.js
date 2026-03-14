const express = require('express');
const router = express.Router();
const { checkout,payForOrder,updateOrderToPaid } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
router.post('/checkout', protect, checkout);
router.post('/:id/pay', protect, payForOrder);
router.post('/:id/update-to-paid', protect, updateOrderToPaid);
module.exports = router;
