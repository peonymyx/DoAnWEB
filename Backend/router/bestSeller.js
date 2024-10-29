const express = require("express");
const router = express.Router();
const { bestSeller } = require("../controller/bestSellerController");

router.get("/best-sellers", bestSeller);

module.exports = router;