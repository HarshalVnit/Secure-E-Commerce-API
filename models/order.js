const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true

    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',// Points to your Product model
                required: true
            },

            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,

                required: true,
                min: 1
            },
            price: {
                type: mongoose.Schema.Types.Decimal128,
                required: true,
                min: 0
            }
        }
    ]
    ,
    totalPrice: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        min: 0
    },
    isPaid: {
        type: Boolean,
        default: false

    }
    ,
    paidAt: {
        type:Date
    }
});

// module.exports = mongoose.model('order', orderSchema);

// However, in professional databases, "Order History" isn't an array that we store inside the User. Instead, "Order History" is just a Search Result.

// Think about it like this:

// On Monday, Harshal checks out. We create Order 1 in the database where user: Harshal_ID.

// On Friday, Harshal checks out again. We create Order 2 in the database where user: Harshal_ID.

// When Harshal clicks the "My Order History" button on the frontend, our backend simply runs this code:
// const history = await Order.find({ user: Harshal_ID });