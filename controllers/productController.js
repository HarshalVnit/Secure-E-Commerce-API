
const Product=require('../models/product');
const Review = require('../models/review');
// Create a new product
const Order = require('../models/order');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });


    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const newProduct = new Product({
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
        const deletedProduct = await Product.findByIdAndDelete(id);
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
        const updatedProduct = await Product.findByIdAndUpdate(
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
        const products = await Product.find(searchLogic);

        // 3. THE RESPONSE:
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProductReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId  = req.params.id;//because in rout we are naming var as id so explicite we have to do this naito waha router me /:productId kar do.
        const { rating, comment } = req.body;
        //first check if producvt exist or first check if user ha successfully paid or not you have to anyways check both
        //but if products not even exist then checking paid or not is useless
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if the user has already reviewed this product
        const alreadyReviewed =await Review.findOne({ user: userId, product: productId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        //now check if user has paid ort not
        const hasPaid = await Order.findOne({ user: userId, 'orderItems.product': productId, isPaid: true });//see explaination below[$1]
        if (!hasPaid) {
            return res.status(400).json({ message: 'You can only review products you have purchased' });
        }
        // If all checks pass, create the review
        const newReview = new Review({
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
        //but no customer gives review10 times per day only but customer visits product incredibly more times so its better to just add rating and divide when asked
        // so when vidited we have to compute averqae mre time so it is better to compute itwhile giving Reviews
product.rating= (product.rating * product.numReviews + Number(rating)) / (product.numReviews + 1); 
        const updatedproduct = await Product.findByIdAndUpdate(productId, {
            $inc: { numReviews: 1 }, // Increment the number of reviews by 1
            $set: {
                rating: product.rating
            }
        }, { new: true });
        res.status(201).json(savedReview);


    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//explaination for [$1]:
// The Plain JavaScript Way (What you were thinking):
// If you had an array of orders in memory, you would have to write this:

// JavaScript
// const hasPaid = orders.find((order) => {
//     // 1. Match the user
//     // 2. Check if paid
//     // 3. LOOP through the array to find the product
//     return order.user === userId && 
//            order.isPaid === true && 
//            order.orderItems.some(item => item.product.toString() === productId); 
// });
// The MongoDB "Dot Notation" Magic:
// MongoDB knows that looping through arrays in JavaScript is slow. So, they built a feature directly into the database engine called Dot Notation.

// When you write 'orderItems.product': productId in a Mongoose query, you are triggering a built-in C++ loop deep inside MongoDB.
// It translates to: "Look at the orderItems array. Does any single object inside this array have a product field that matches this ID?"

// It does the loop for you, and it does it 100x faster than JavaScript can. That is why we use that simple, beautiful one-liner!
module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    searchProduct,
    createProductReview

};

   
