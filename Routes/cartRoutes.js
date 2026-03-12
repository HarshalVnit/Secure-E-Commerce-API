const express = require('express');
const router = express.Router();
const {
    addToCart, getCart, removeFromCart  
} = require('../controllers/cartController');
const { protect, admin } = require('../middleware/authMiddleware');
// Route: POST /api/cart/add
router.post('/add', protect, addToCart);

// Route: GET /api/cart
router.get('/', protect, getCart);

// Route: DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', protect, removeFromCart  );

module.exports = router;