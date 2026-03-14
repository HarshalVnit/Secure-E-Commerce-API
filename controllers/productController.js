
const product=require('../models/product');
const review = require('../models/review');
// Create a new product

const getProducts = async (req, res) => {
    try {
        const products = await product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });


    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const newProduct = new product({
            name,
            description,
            price,
            stock,
            category    
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });       
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {

            return res.status(404).json({ message: "Product not found" });
        }


        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;
        const updatedProduct = await product.findByIdAndUpdate(
            id,
             { name, description, price, stock, category },//what things are updated
            { new: true }
        );  
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

// searchProduct = async (req, res) => {
//     try {
//         const { name, price } = req.query;
//         const searchprod = await product.find({
//             name: { $regex: name, $options: 'i' }, // Case-insensitive search
//             price: { $lte: price } // Find products with price less than or equal to the specified price
//         });
//         res.json(searchprod);
//     }
//         })
//     }
// }
const searchProduct = async (req, res) => {
    try {
        // 1. THE TRAP: Check if a query parameter named 'keyword' exists in the URL
        let searchLogic = {}; // Start with an empty object (which means 'find everything')

        if (req.query.keyword) {
            // If the user typed a search term, we build a regex search object
            searchLogic = {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i' // Make it case-insensitive
                }
            };
        }

        // 2. THE SEARCH: 
        // If there was no keyword, searchLogic is {}, so it finds all products.
        // If there WAS a keyword, searchLogic looks like { name: { $regex: 'laptop', $options: 'i' } }
        const products = await product.find(searchLogic);

        // 3. THE RESPONSE:
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProductReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { rating, comment } = req.body;
        //first check if producvt exist or first check if user ha successfully paid or not you have to anyways check both
        //but if products not even exist then checking paid or not is useless
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if the user has already reviewed this product
        const alreadyReviewed = review.findOne({ user: userId, product: productId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        //now check if user has paid ort not
        const hasPaid = await Order.findOne({ user: userId, 'orderItems.product': productId, isPaid: true });
        if (!hasPaid) {
            return res.status(400).json({ message: 'You can only review products you have purchased' });
        }
        // If all checks pass, create the review
        const newReview = new review({
            user: userId,
            product: productId,
            name: req.user.name, // Assuming you have the user's name in the req.user object
            rating,
            comment
        });
        const savedReview = await newReview.save();
        // Update the product's average rating and number of reviews
        //now we will just add this rating and add+1 in num so find myid and then update
        //i will nto perform average every time its complex i will just divide once when asked
        const updatedproduct = await Product.findByIdAndUpdate(productId, {
            $inc: { numReviews: 1 }, // Increment the number of reviews by 1
            $set: {
                rating: product.rating + rating
            }
        }, { new: true });
        res.status(201).json(savedReview);


    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    searchProduct
};

   
