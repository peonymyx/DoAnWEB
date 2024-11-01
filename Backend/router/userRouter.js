const express = require("express");
const router = express.Router();

const {
  getUsers,
  updateUser,
  getUserById,
  updateRole,
  wishListProduct,
  removeFromWishList,
  getWishListProduct,
  addCouponToAllUsers,
  addCouponToUser,
  getUserCoupons
} = require("../controller/userController");
const { isAdmin, allowRole } = require("../middleware/middlewareController");
const fileUpload = require("../middleware/cloudinary");

router.get("/", allowRole(["admin"]), getUsers);
router.put("/updateRole", updateRole);
router.put("/:id", fileUpload.single("avatar"), updateUser);
router.get("/:id", getUserById);
router.post("/wishListProduct", wishListProduct);
router.delete("/removeFromWishList/:id/:productId", removeFromWishList);
router.get("/wishListProduct/:id", getWishListProduct);
// Route để thêm coupon vào danh sách của tất cả người dùng
router.post('/coupons/add-to-all', allowRole(["admin"]), addCouponToAllUsers);

// Route để thêm coupon vào danh sách của một người dùng
router.post('/:userId/coupons/:couponId',  allowRole(["admin"]), addCouponToUser);

// Route để lấy danh sách coupon khả dụng của một người dùng
router.get('/:userId/coupons', getUserCoupons);

module.exports = router;
