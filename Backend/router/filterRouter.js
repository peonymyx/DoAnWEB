const express = require("express");
const router = express.Router();

const {
    filterSize,
    filterCategory,
    filterPrice
} = require("../controller/filterController");

router.get("/filterSize", filterSize); // Lọc theo size
router.get("/filterCategory", filterCategory); // Lọc theo thể loại
router.get("/filterPrice", filterPrice); // Lọc theo giá

module.exports = router;