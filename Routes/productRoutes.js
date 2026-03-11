const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route: POST /api/products
router.get('/', protect,admin,getProducts);
router.post('/', protect, admin, createProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id', protect, admin, updateProduct);

module.exports = router;