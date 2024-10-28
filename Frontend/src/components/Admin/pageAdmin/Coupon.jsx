import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon,
  fetchCoupons,
  deleteCoupon,
  updateCoupon,
} from "../../../redux/couponSlice";
const CouponAdmin = () => {
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupons.coupons);
  console.log("coupons", coupons);

  const [newCouponCode, setNewCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Giả lập dữ liệu ban đầu
  useEffect(() => {
    dispatch(fetchCoupons());
  }, []);

  const handleAddCoupon = () => {
    if (!newCouponCode || !discount || !expiryDate) return;

    const selectedDate = new Date(expiryDate);

    // Kiểm tra xem ngày hết hạn có phải là ngày trong quá khứ không
    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0

    // if (selectedDate < today) {
    //   alert("Ngày hết hạn không được là ngày trong quá khứ!"); // Hiện thông báo lỗi
    //   return;
    // }
    const newCoupon = {
      code: newCouponCode,
      discount: parseFloat(discount),
      expiryDate,
    };
    dispatch(createCoupon(newCoupon));
    resetForm();
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setNewCouponCode(coupon.code);
    setDiscount(coupon.discount);
    setExpiryDate(coupon.expiryDate);
  };

  const handleUpdateCoupon = () => {
    if (!editingCoupon) return;

    const updatedCoupon = {
      code: newCouponCode,
      discount: discount,
      expiryDate: expiryDate,
    };

    console.log("Updating coupon with ID:", editingCoupon._id); // Kiểm tra giá trị ID

    dispatch(
      updateCoupon({ id: editingCoupon._id, couponData: updatedCoupon })
    ); // Gọi dispatch để cập nhật coupon
    resetForm();
  };

  const handleDeleteCoupon = (id) => async () => {
    console.log("xóa ", id);
    try {
      dispatch(deleteCoupon(id));
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  const resetForm = () => {
    setNewCouponCode("");
    setDiscount("");
    setExpiryDate("");
    setEditingCoupon(null);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Quản Lý Mã Coupon</h2>

      {/* Form nhập coupon */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={newCouponCode}
          onChange={(e) => setNewCouponCode(e.target.value)}
          placeholder="Nhập mã coupon"
          className="border px-3 py-2 rounded w-1/3"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Giảm giá (%)"
          className="border px-3 py-2 rounded w-1/3"
        />

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
          className={`px-4 py-2 rounded text-white ${
            editingCoupon
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {editingCoupon ? "Cập Nhật" : "Thêm"}
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm mã coupon..."
        className="border mb-4 px-3 py-2 rounded w-full"
      />

      {/* Bảng hiển thị coupon */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Mã Coupon</th>
            <th className="border px-4 py-2">Giảm Giá (%)</th>
            <th className="border px-4 py-2">Ngày Hết Hạn</th>
            <th className="border px-4 py-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoupons.map((coupon) => (
            <tr
              key={coupon.id}
              className={
                new Date(coupon.expiryDate) < new Date() ? "bg-red-100" : ""
              }
            >
              <td className="border px-4 py-2">{coupon.code}</td>
              <td className="border px-4 py-2">{coupon.discount}%</td>
              <td className="border px-4 py-2">
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </td>

              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditCoupon(coupon)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Sửa
                </button>
                <button
                  onClick={handleDeleteCoupon(coupon._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponAdmin;
