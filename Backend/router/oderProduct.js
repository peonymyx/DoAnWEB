const express = require("express");
const {
  addOtherProduct,
  getOtherProduct,
  getOtherById,
  updateStatusOder,
} = require("../controller/oderController");
const router = express.Router();

router.post("/add", addOtherProduct);
router.get("/", getOtherProduct);
router.get("/:id", getOtherById);
router.put("/update", updateStatusOder);

module.exports = router;
