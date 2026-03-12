const product = require('./product');

const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true

    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',// Points to your Product model
                required: true

            },
            
            quantity: {
                type: Number,
                required: true,
                min: 1
            }

            
        }
    ]
});
module.exports = mongoose.model('cart', cartSchema);