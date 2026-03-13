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
            isPaid: true,
            paidAt: Date.now()
        });

        const savedOrder = await order.save();
        // Clear the user's cart
        cart.cartItems = [];
        await cart.save();
        res.status(201).json(savedOrder);


    }
    catch (error) {
        res.status(500).json({ message: error.message });


    }
};

const payForOrder = async (req, res) => {
    try {
        const { orderId } = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // / 2. The Math: Convert the Decimal128 price to a standard Number, then to Cents.
        // Example: $50.00 * 100 = 5000 cents. Math.round prevents weird decimal errors.
        const amountIncents = Math.round(parsefloat(order.totalPrice.toString()) * 100);
        

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
module.exports = {
    checkout,
    payForOrder
};