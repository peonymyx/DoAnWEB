import { Link } from "react-router-dom";
import axios from "axios";
import {
  decrementQuantity,
  incrementQuantity,
  removeCart,
  selectCart,
} from "../redux/cartSlice";
import { updateUser, getUserById } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/post/Footer";
import { useEffect, useState } from "react";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.currentUser);
  const cart = useSelector(selectCart);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);

  console.log("auth", auth.CouponList);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (auth) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/users/${auth._id}/coupons`
          );
          setCoupons(response.data);
        } catch (error) {
          console.error("Error fetching coupons:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCoupons();
  }, [auth]);

  useEffect(() => {
    // Cập nhật danh sách mã giảm giá được lọc khi coupons hoặc searchTerm thay đổi
    setFilteredCoupons(
      coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [coupons, searchTerm]);

  const handleCouponSelect = (couponCode) => {
    setSelectedCoupon(couponCode);
  };

  const applyCoupon = () => {
    if (!selectedCoupon) {
      alert("Vui lòng chọn mã giảm giá trước!");
      return;
    }

    // Find the selected coupon
    const coupon = coupons.find((c) => c.code === selectedCoupon);
    if (!coupon) {
      alert("Mã giảm giá không hợp lệ!");
      return;
    }

    // Calculate the discounted total
    const discount = coupon.discount / 100;
    const { totalPrice } = getTotal(); // Get the original total price
    const discountedPrice = totalPrice * (1 - discount);
    setDiscountedTotal(discountedPrice);
    alert(`Mã giảm giá ${selectedCoupon} đã được áp dụng!`);
  };

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price;
    });
    return {
      totalQuantity,
      totalPrice,
      discountedTotal: discountedTotal || totalPrice,
    };
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  if (!auth) {
    navigate("/login");
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p>
          Vui Lòng{" "}
          <a href="/login" className="text-cyan-500">
            {" "}
            đăng nhập{" "}
          </a>{" "}
          để tiếp tục...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-28">
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">
            DANH SÁCH SẢN PHẨM ĐÃ CHỌN
          </h1>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {cart.length > 0 &&
              cart.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}`}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt="Sản phẩm"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">
                        {item.name} - {item.size}
                      </h2>
                      <p className="text-gray-600">
                        {" "}
                        Giá: {formatPrice(item.price)}
                      </p>

                      <div className=" flex">
                        <p className="mt-1">Số Lượng:</p>
                        <button
                          onClick={() =>
                            dispatch(incrementQuantity(item.product_id))
                          }
                          className=" text-xl mx-3 w-5 h-5 bg-slate-200 mt-1 inline-flex items-center justify-center"
                        >
                          +
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          className="w-20"
                        />
                        <button
                          onClick={() =>
                            dispatch(decrementQuantity(item.product_id))
                          }
                          className=" text-xl mx-3 mx-3 w-5 h-5 bg-slate-200 mt-1 inline-flex items-center justify-center"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => dispatch(removeCart(item.product_id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Nhập mã giảm giá */}
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-lg font-semibold mb-4">MÃ GIẢM GIÁ</h2>
            {filteredCoupons.length === 0 ? (
              <p>Không có mã giảm giá nào.</p>
            ) : (
              <ul className="bg-white shadow-md rounded p-4">
                {filteredCoupons.map((coupon) => (
                  <li
                    key={coupon._id}
                    className="flex justify-between items-center border-b py-2"
                    onClick={() => {
                      handleCouponSelect(coupon.code);
                    }}
                  >
                    <span className="text-lg">{coupon.code}</span>
                    <span className="text-lg text-green-600">
                      {coupon.discount}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="text"
              value={selectedCoupon}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập mã giảm giá..."
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button
              onClick={() => {
                applyCoupon();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Áp dụng
            </button>
          </div>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-lg font-semibold mb-4">TỔNG TIỀN</h2>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Tổng cộng:</p>
              <p className="font-semibold">
                {formatPrice(getTotal().discountedTotal)}
              </p>
            </div>
          </div>
          {/* Nút tiếp tục thanh toán */}
          <div className="mt-8">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
              onClick={() => {
                const CouponList = coupons.filter(
                  (c) => c.code !== selectedCoupon
                );
                dispatch(updateUser({ CouponList: CouponList }));
              }}
            >
              <Link
                to="/payproducts"
                state={{ discountedTotal: getTotal().discountedTotal }}
              >
                Tiếp tục thanh toán
              </Link>
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Cart;
