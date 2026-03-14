const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'product',
        required: true
    },
    name: {
        type: String,
        required: true
    },//(The name of the user leaving the review, so we don't have to populate the user just to show their name!).
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model('review', reviewSchema);