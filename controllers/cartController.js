// const cart = require('../models/cart');

//we will make add to cart function first
//for that when user clicks add to cart
//firstly we will checkif product is already in there it is is then we will update new quantity given
// else
    // we will add new produvts
//we will also check if user has a cart or not if not we will create new cart for him and add product to it

const Cart = require('../models/cart');
// const Product = require('../models/product');
const Product = require('../models/product');
const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { productId, quantity = 1 } = req.body; 

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ owner: userId });
        
        // We will store our success/warning message in this variable
        let responseMessage = "Item added to cart successfully!"; 

        if (!cart) {
            // SCENARIO A: No cart exists
            let finalQuantity = quantity;
            
            // Auto-adjust if they ask for too much
            if (quantity > product.stock) {
                finalQuantity = product.stock;
                responseMessage = `We only have ${product.stock} in stock. Adjusted your quantity to the maximum available.`;
            }

            const newCart = await Cart.create({
                owner: userId,
                cartItems: [{ product: productId, quantity: finalQuantity }]
            });
            return res.status(201).json({ message: responseMessage, cart: newCart });
        }

        // SCENARIO B: Cart exists
        const itemIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Item ALREADY in cart
            const newTotalQuantity = cart.cartItems[itemIndex].quantity + quantity;

            if (newTotalQuantity > product.stock) {
                // Auto-adjust to the absolute maximum stock we have
                cart.cartItems[itemIndex].quantity = product.stock;
                responseMessage = `You requested more than we have. We've maximized your cart to our total stock of ${product.stock}.`;
            } else {
                // Safe to add exactly what they asked for
                cart.cartItems[itemIndex].quantity = newTotalQuantity;
            }
        } else {
            // Item NOT in cart yet
            let finalQuantity = quantity;
            
            if (quantity > product.stock) {
                finalQuantity = product.stock;
                responseMessage = `We only have ${product.stock} in stock. Adjusted your quantity to the maximum available.`;
            }

            cart.cartItems.push({ product: productId, quantity: finalQuantity });
        }

        await cart.save();
        
        // Return both the message and the cart so the frontend can show the alert
        res.status(200).json({ message: responseMessage, cart });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//the upper code handle stock situation this code doesnt handle stock situation it just add to cart without checking stock
// const Cart = require('../models/cart'); // Adjust path if needed
// // const Product = require('../models/product'); 

// const addToCart = async (req, res) => {
//     try {
//         // 1. Get the data from the request
//         // We get the user ID from the protect middleware, and the product info from the body
//         const userId = req.user._id; 
//         const { productId, quantity = 1 } = req.body; 

//         // 2. Look for an existing cart for this user
//         let cart = await Cart.findOne({ owner: userId });

//         if (!cart) {
//             // SCENARIO A: The user has no cart yet. Create a brand new one.
//             const newCart = await Cart.create({
//                 owner: userId,
//                 cartItems: [
//                     { product: productId, quantity: quantity }
//                 ]
//             });
//             return res.status(201).json(newCart);
//         }

//         // SCENARIO B: The cart exists. Now we check the array.
//         // We use .findIndex() to search the array. 
//         // IMPORTANT: We use .toString() because MongoDB ObjectIds look like strings but are actually objects!
//         const itemIndex = cart.cartItems.findIndex(
//             (item) => item.product.toString() === productId
//         );
//         //old version
//         // const itemIndex = cart.cartItems.findIndex(function(item) {
//     // return item.product.toString() === productId;
// // });

//         if (itemIndex > -1) {
//             // The product IS already in the array (index is 0 or higher)
//             // Just update the quantity of that specific item
//             cart.cartItems[itemIndex].quantity += quantity;
//         } else {
//             // The product is NOT in the array (index is -1)
//             // Use the standard array .push() method to add the new object
//             cart.cartItems.push({ product: productId, quantity: quantity });
//         }

//         // 3. Save the updated cart back to the database
//         await cart.save();
        
//         // 4. Send the updated cart back to the user
//         res.status(200).json(cart);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ owner: userId }).populate('cartItems.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });

            
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // 1. Get the ID of the product they want to remove from the URL parameters
        const { productId } = req.params; 

        // 2. Find the user's cart
        const cart = await Cart.findOne({ owner: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // We keep every item WHERE the product ID does NOT match the one we want to delete.
        cart.cartItems = cart.cartItems.filter(
            (item) => item.product.toString() !== productId
        );

        // 4. Save the updated cart (Mongoose will automatically update the array in the database)
        await cart.save();

        // 5. Populate the remaining items so the frontend gets the full product details back
        await cart.populate('cartItems.product');

        res.status(200).json(cart);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addToCart, getCart, removeFromCart  
};
    
 