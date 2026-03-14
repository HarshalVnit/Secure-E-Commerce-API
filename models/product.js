const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    //in our product we will use decimal 128 to store price because it is more accurate than float or double
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    //we have these category in our products Groceries,Leisure,Electronics,Utilities,Clothing,Health,Others.
    //hne we will make an enum of these categories so that user can only select from these categories
    type: String,
    required: true,
    enum: [
      "Groceries",
      "Leisure",
      "Electronics",
      "Utilities",
      "Clothing",
      "Health",
      "Others",
    ],
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("product", productSchema);
