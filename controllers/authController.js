const User = require("../models/user");
//2 DOTS BECAUSE WHEN AUTH CONTROLLER RUNS IT RUNS WRT TO ISTELF DO ./MODEL MEASN IT CHECKS MODEL IN ITS FOLDDER ONLY SO WE DO .. SO THAT IT GOES ONE LEVEL UP AND CHECKKS
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};


const registerUser = async (req, res) => {
    try {


        const { userName, email, password, isAdmin } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
        userName,
        email,
        password,
        isAdmin
    });

    res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });
        
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;   
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};  