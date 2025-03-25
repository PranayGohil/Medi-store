import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const adminAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.admin = { id: decoded.id };

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default adminAuth;
