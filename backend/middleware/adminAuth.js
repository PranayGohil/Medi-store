import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(token_decode !== "Admin" + process.env.ADMIN_EMAIL){
        return res.json({ success: false, message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Unauthorized" });
  }
};

export default adminAuth;
