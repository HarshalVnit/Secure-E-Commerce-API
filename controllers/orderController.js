//implementing checkout function
//first we will extract the cart of the user
//then we will calculate total amount
// then we will create order and assign it a user and order items and total price
const Cart = require('../models/cart');
const Order = require('../models/order');


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const checkout = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ owner: userId }).populate('cartItems.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Calculate total price
        let totalPrice = 0;
        cart.cartItems.forEach(item => {
            const productPrice = parseFloat(item.product.price.toString());
    
            // 2. Do the math safely
            totalPrice += (productPrice * item.quantity);


        });
            
            
            //this is wrong
            // totalPrice += item.product.price * item.quantity
            // The Crash: When Mongoose fetches a Decimal128 from the database, it doesn't bring it back as a normal JavaScript number. It brings it back as a complex Object. If you try to do Object * 2, JavaScript will return NaN (Not a Number) or crash.
            


        // Create a new order
        const order = new Order({
            user: userId,
            orderItems: cart.cartItems.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            })),
            totalPrice: totalPrice,
            isPaid: false,
            // paidAt: Date.now() we will confirm only afte stripe payment is successful
        });

        const savedOrder = await order.save();
        // Clear the user's cart
        // cart.cartItems = [];
        // await cart.save();
        res.status(201).json(savedOrder);


    }
    catch (error) {
        res.status(500).json({ message: error.message });


    }
};

const payForOrder = async (req, res) => {
    try {
        const orderId  = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // / 2. The Math: Convert the Decimal128 price to a standard Number, then to Cents.
        // Example: $50.00 * 100 = 5000 cents. Math.round prevents weird decimal errors.
        const amountInCents = Math.round(parseFloat(order.totalPrice.toString()) * 100);
        

        // 3. The Secret Meeting: Ask Stripe for a "Payment Intent"
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd', // You can change this to 'inr' if you want!
        });
        res.status(200).json({
            message: "Payment initiated successfully",
            clientSecret: paymentIntent.client_secret
        });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateOrderToPaid = async (req, res) => {
    try {
        // 1. Find the order we just paid for
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // 2. Mark the order as successfully paid!
        order.isPaid = true;
        order.paidAt = Date.now();
        
        // Save the updated receipt
        const updatedOrder = await order.save();

        // 3. Find the user's cart and FINALLY empty it
        const cart = await Cart.findOne({ owner: req.user._id });
        if (cart) {
            cart.cartItems = [];
            await cart.save();
        }

        // 4. Send the final, paid receipt back to the frontend
        res.status(200).json(updatedOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Just keep one thing in mind for the future: If the StoreBoss ever completely deletes a product from the database, .populate() will return null for that item. That is exactly why we saved the name and price directly in the Order model! Even if the original product is deleted from the store, the customer's receipt will still safely show "Pro Gaming Mouse - $50".
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).populate('orderItems.product');
        //this populate mean that for every order, look at the orderItems array, and for each item in that array, look at the product field, and replace that product ID with the full product details from the Product collection. So instead of just getting back a product ID, we get back the entire product object with all its details (name, price, description, etc.) in each order item. This way, when we send the orders back to the frontend, it has all the information it needs to display the order history properly.
        res.status(200).json(orders);
    }
    catch(error)
    {
res.status(500).json({ message: error.message });
    }
}

const getAdminDashboard = async (req, res) => 
    {
    try
    {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const revenueData = await Order.aggregate([
            {
                $match: { isPaid: true }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        res.status(200).json({ 
            "totalorders": totalOrders,
            "totalusers": totalUsers,
            "totalrevenue": revenueData[0] ? revenueData[0].totalRevenue : 0
        })  ;
        
        
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    checkout,
    payForOrder,
    updateOrderToPaid,
    getMyOrders,
    getAdminDashboard
};
    
// aggregation pipeline explanation for revenueData:
//     Think of the aggregate() function as a literal factory assembly line (a conveyor belt).

// If you use find(), MongoDB just grabs a bunch of boxes (documents) and throws them at your Node.js server. Node.js then has to open every box and do the math. If you have 1 million orders, your server crashes.

// With aggregate(), you send the math instructions into the database itself. MongoDB does the heavy lifting on its ultra-fast C++ servers, and only hands your Node.js server the final, single answer.

// You pass an array [] into aggregate() because you are giving the factory a list of "Stages" (machines on the assembly line).

// Stage 1: $match (The Filter)
// JavaScript
// { $match: { isPaid: true } }
// Imagine 1,000 Order documents rolling down the conveyor belt.
// The $match machine is a bouncer. It looks at every order.

// "Are you paid? No? Get off the belt."

// "Are you paid? Yes? Keep moving forward."

// Only the orders where isPaid is strictly true survive this stage and move to the next machine.

// Stage 2: $group (The Accountant)
// JavaScript
// { 
//     $group: { 
//         _id: null, 
//         totalRevenue: { $sum: "$totalPrice" } 
//     } 
// }
// Now, only the successful, paid orders arrive at the $group machine.

// _id: null: The $group machine usually groups things by category (e.g., _id: "$category" would give you separate totals for "Electronics" vs "Clothing"). By saying _id: null, we are telling the machine: "I don't care about categories. Smash every single order on this belt into one giant, single pile."

// totalRevenue: { $sum: "$totalPrice" }: Now that they are in one giant pile, create a new label called totalRevenue. Go into every order, find the $totalPrice field, extract the number, and add ($sum) them all together.

// The machine spits out one final object: { _id: null, totalRevenue: 5000 }.