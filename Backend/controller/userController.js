const User = require("../models/Users")
const Coupon = require("../models/Coupon")
const Product = require("../models/Product.js")
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  // neu co file thi lay file khong thi lay avatar cu
  const avatar = req.file ? req.file.path.replace(/\\/g, "/") : req.body.avatar;
  const { username, email, phone, address, age, gender } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        username,
        email,
        phone,
        address,
        age,
        gender,
        avatar,
      },
      { new: true }
    );
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  const { id, role } = req.body;
  const user = await User.findByIdAndUpdate(id, {
    role,
  });
  res.status(200).json({ user });
};

const wishListProduct = async (req, res) => {
  const { id, productId } = req.body;

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy." });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }

    // Thêm productId vào wishList nếu chưa có
    if (!user.wishList.includes(productId)) {
      user.wishList.push(productId);
      await user.save();
    }

    res.status(200).json({ wishList: user.wishList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishListProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy." });
    }
    res.status(200).json({ wishList: user.wishList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addCouponToUser = async (req, res) => {
  const { userId, couponId } = req.params;

  try {
      // Tìm người dùng theo userId
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'Người dùng không tìm thấy.' });
      }

      // Kiểm tra xem coupon có tồn tại không
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
          return res.status(404).json({ message: 'Coupon không tìm thấy.' });
      }

      // Thêm coupon vào danh sách coupon khả dụng của người dùng nếu chưa có
      if (!user.availableCoupons.includes(couponId)) {
          user.availableCoupons.push(couponId);
          await user.save();
      }

      res.status(200).json({ message: 'Coupon đã được thêm vào danh sách.', availableCoupons: user.availableCoupons });
  } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra.', error });
  }
};

const addCouponToAllUsers = async (req, res) => {
  const { couponId } = req.body; // Nhận couponId từ body yêu cầu

  try {
      // Kiểm tra xem coupon có tồn tại không
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
          return res.status(404).json({ message: 'Coupon không tìm thấy.' });
      }

      // Lấy danh sách tất cả người dùng
      const users = await User.find();

      // Cập nhật danh sách coupon khả dụng cho từng người dùng
      await Promise.all(users.map(async (user) => {
          if (!user.availableCoupons.includes(couponId)) {
              user.availableCoupons.push(couponId);
              await user.save();
          }
      }));

      res.status(200).json({ message: 'Coupon đã được thêm vào danh sách của tất cả người dùng.' });
  } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra.', error });
  }
};

// Lấy danh sách coupon khả dụng của người dùng
const getUserCoupons = async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await User.findById(userId).populate('CouponList');
      if (!user) {
          return res.status(404).json({ message: 'Người dùng không tìm thấy.' });
      }

      res.status(200).json(user.CouponList);
  } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra.', error });
  }
};


module.exports = {
  getUsers,
  updateUser,
  getUserById,
  updateRole,
  wishListProduct,
  getWishListProduct,
  addCouponToUser,
  getUserCoupons,
  addCouponToAllUsers
};
