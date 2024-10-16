const express = require("express");
const router = express.Router();

const {
    filterSize,
    filterCategory,
    filterPrice
} = require("../controller/filterController");

router.get("/filterSize", filterSize);
router.get("/filterCategory", filterCategory);
router.get("/filterPrice", filterPrice);