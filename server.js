const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
// Connect to Database
connectDB();
const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT;


app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/products", require("./Routes/productRoutes"));
app.use("/api/cart", require("./Routes/cartRoutes"));
app.use("/api/orders", require("./Routes/orderRoutes"));



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

//added comment
