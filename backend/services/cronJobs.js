import Coupon from "../models/couponModel.js";

const expireOldCoupons = async () => {
  try {
    const now = new Date();
    const result = await Coupon.updateMany(
      { expiration_date: { $lt: now }, status: "active" },
      { $set: { status: "expired" } }
    );
    console.log(`${result.modifiedCount} coupons marked as expired.`);
  } catch (error) {
    console.error("Failed to update expired coupons:", error);
  }
};

cron.schedule("0 0 * * *", () => {
  console.log("⏰ Running daily coupon expiration check...");
  expireOldCoupons();
});
