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




// {
//     "_id": "69b55b8d011fc79cb6474a3c",
//     "userName": "JohnShopper",
//     "email": "john@gmail.com",
//     "isAdmin": false,
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjU1YjhkMDExZmM3OWNiNjQ3NGEzYyIsImlhdCI6MTc3MzQ5MzEzNCwiZXhwIjoxNzc2MDg1MTM0fQ.KhMKSAgF6hOlEyU_RPdkhvJoU18brOTkZRsDnAZ_DDk"
// }

// {
//     "_id": "69b55b51011fc79cb6474a39",
//     "userName": "StoreBoss",
//     "email": "admin@store.com",
//     "isAdmin": true,
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjU1YjUxMDExZmM3OWNiNjQ3NGEzOSIsImlhdCI6MTc3MzQ5MzA3MywiZXhwIjoxNzc2MDg1MDczfQ.Gxup8EtIsZHYTU5GuE5UtiMyQBT7a_z0rhYclcjaLTo"
// }

//login
// {
//     // "_id": "69b55b51011fc79cb6474a39",
//     // "userName": "StoreBoss",
//     // "email": "admin@store.com",
//     // "isAdmin": true,
//     // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjU1YjUxMDExZmM3OWNiNjQ3NGEzOSIsImlhdCI6MTc3MzQ5MzMyMywiZXhwIjoxNzc2MDg1MzIzfQ.wDyDolIk47aC9q9XDIefB53isoWLERd9Zf7vKSVhFCA"
// }

// {
//     "_id": "69b55b8d011fc79cb6474a3c",
//     "userName": "JohnShopper",
//     "email": "john@gmail.com",
//     "isAdmin": false,
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjU1YjhkMDExZmM3OWNiNjQ3NGEzYyIsImlhdCI6MTc3MzQ5MzY2NSwiZXhwIjoxNzc2MDg1NjY1fQ.aOHCIx5kySsTqceB-_3tOe-MkMtW8TTxWrUW79R2a-M"
// }



// {
//     "name": "Pro Gaming Mouse",
//     "description": "Super fast wireless mouse",
//     "price": {
//         "$numberDecimal": "50"
//     },
//     "stock": 100,
//     "category": "Electronics",
//     "_id": "69b55d1f8a81e2db784ebad1",
//     "__v": 0
// }






// {
//     "message": "Item added to cart successfully!",
//     "cart": {
//         "owner": "69b55b8d011fc79cb6474a3c",
//         "cartItems": [
//             {
//                 "product": "69b55d1f8a81e2db784ebad1",
//                 "quantity": 2,
//                 "_id": "69b560bb03d4e8c326bfd76a"
//             }
//         ],
//         "_id": "69b560bb03d4e8c326bfd769",
//         "__v": 0
//     }
// }