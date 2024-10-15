const express = require("express");
const router = express.Router();
const { bestSeller } = require("../controller/bestSellerController");

router.get("/bestSeller", bestSeller);

module.exports = router;