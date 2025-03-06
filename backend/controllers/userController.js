import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
}
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(user._id);

    res.json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check user already exist or not
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.json({ success: false, message: "Email already exist" });
    }

    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.json({ success: false, message: "Phone number already exist" });
    }

    // validate user email, phone and password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (!validator.isMobilePhone(phone)) {
      return res.json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message: "Please choose a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = generateToken(user._id);

    res.json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        const token = jwt.sign("Admin" + email, process.env.JWT_SECRET_KEY);
        return res.json({success: true, message: "Admin logged in successfully", token});
    } else {
        return res.json({success: false, message: "Incorrect email or password"});
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
