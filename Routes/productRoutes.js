const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct, updateProduct,searchProduct,createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts); 
router.get('/search', searchProduct);
router.post('/:id/reviews', protect, createProductReview);
// Route: POST /api/products
// router.get('/', protect, admin, getProducts);//no need to admin or user to get or search
router.post('/', protect, admin, createProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id', protect, admin, updateProduct);

module.exports = router;