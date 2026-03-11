
const product=require('../models/product');

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

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    searchProduct
};

   
