const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
router.post('/checkout', protect, checkout);
module.exports = router;
