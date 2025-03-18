import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
};
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

    const userWithoutPassword = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
    };

    const cartData = user.cartData;

    res.json({
      success: true,
      message: "logged in successfully",
      token,
      user: userWithoutPassword,
      cartData,
    });
  } catch (error) {}
};

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    // Check user already exist or not
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.json({ success: false, message: "Email already exist" });
    }

    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.json({
        success: false,
        message: "Phone number already exist",
      });
    }

    // validate user email, phone and password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
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
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = generateToken(user._id);

    const userWithoutPassword = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
    };

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const { first_name, last_name, email, phone } = req.body;
    console.log("Body: ", req.body);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({  success: false, message: "User not found" });
    }

    // Update user details
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.phone = phone;

    await user.save();

    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(address);
    await user.save();

    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeAddress = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const addressId = req.params.addressId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the address with the given addressId
    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== addressId
    );

    await user.save();

    res.json({ message: "Address removed successfully" });
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign("Admin" + email, process.env.JWT_SECRET_KEY);
      return res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "Incorrect email or password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  getUser,
  getAllUsers,
  adminLogin,
  updateUser,
  addAddress,
  getAddresses,
  removeAddress,
};
