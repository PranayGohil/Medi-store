import Coupon from "../models/couponModel.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res.status(500).json({ error: "Failed to create coupon" });
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve coupons" });
  }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve coupon" });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    res.status(500).json({ error: "Failed to update coupon" });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coupon" });
  }
};

// Apply Coupon During Checkout
export const applyCoupon = async (req, res) => {
  const { code, total } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    if (coupon.status !== "active") {
      return res.status(400).json({ error: "Coupon is expired or inactive" });
    }

    if (coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ error: "Coupon usage limit reached" });
    }

    if (new Date() > new Date(coupon.expiration_date)) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    let discount = 0;

    if (coupon.discount_type === "percentage") {
      discount = (total * coupon.discount_value) / 100;
      if (coupon.max_discount) {
        discount = Math.min(discount, coupon.max_discount);
      }
    } else {
      discount = coupon.discount_value;
    }

    const discountedTotal = total - discount;

    // Increment usage count
    coupon.used_count += 1;
    await coupon.save();

    res.json({
      message: "Coupon applied successfully",
      discount,
      discountedTotal,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to apply coupon" });
  }
};
