const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  updateSoldCount
} = require("../controller/ProductsController");
  const { isAdmin, allowRole } = require("../middleware/middlewareController");
  const fileUpload = require("../middleware/cloudinary");

router.post(
  "/",
  allowRole(["admin", "nhanvien"]),
  fileUpload.single("image"),
  addProduct
);
router.get("/", getProduct);
router.delete("/:id", allowRole(["admin", "nhanvien"]), deleteProduct);
router.put(
  "/:id",
  allowRole(["admin", "nhanvien"]),
  fileUpload.single("image"),
  updateProduct
);
router.get("/:id", getProductById);
router.put("/:id/updateSoldCount", updateSoldCount);
module.exports = router;
