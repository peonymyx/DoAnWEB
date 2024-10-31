const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

generateAccessToken = (user) => {
  
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
};

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(400).json({ message: "Email không tồn tại" });
    } else if (!(await user.isValidPassword(password))) {
      res.status(400).json({ message: "Tài khoản hoặc Mật khẩu không đúng" });
    } else {
      const token = generateAccessToken({
        role: user.role,
        id: user._id,
      });
      const { password, ...others } = user._doc;
      res.status(200).send({ others, token });
      console.log({ others, token });
      console.log("Đăng nhập thành công");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
