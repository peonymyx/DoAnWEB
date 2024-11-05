import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleAddCoupon = () => {
    if (!newCouponCode || !discount || !expiryDate) return;

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

    console.log("Updating coupon with ID:", editingCoupon._id);

    dispatch(
      updateCoupon({ id: editingCoupon._id, couponData: updatedCoupon })
    );
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

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredCoupons.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );

  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 my-3">
        Quản Lý Mã Coupon
      </h2>

      {/* Form nhập coupon */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-6">
        <input
          type="text"
          value={newCouponCode}
          onChange={(e) => setNewCouponCode(e.target.value)}
          placeholder="Nhập mã coupon"
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Giảm giá (%)"
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <button
          onClick={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
          className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
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
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-blue-800 text-white text-lg">
            <tr>
              <th className="border p-4">Mã Coupon</th>
              <th className="border p-4">Giảm Giá (%)</th>
              <th className="border p-4">Ngày Hết Hạn</th>
              <th className="border p-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.map((coupon) => (
              <tr
                key={coupon.id}
                className={
                  new Date(coupon.expiryDate) < new Date() ? "bg-red-100" : ""
                }
              >
                <td className="border p-4 text-lg font-bold">{coupon.code}</td>
                <td className="border p-4 text-lg">{coupon.discount}%</td>
                <td className="border p-4 text-lg">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="border p-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
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

      {/* Pagination Controls */}
      <div className="sticky bottom-0 right-0 flex justify-end p-4 bg-white">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CouponAdmin;
