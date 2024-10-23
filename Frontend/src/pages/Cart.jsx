import { Link } from "react-router-dom";
import {
  decrementQuantity,
  incrementQuantity,
  removeCart,
  selectCart,
} from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.currentUser);
  const cart = useSelector(selectCart);

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price;
    });
    return { totalQuantity, totalPrice };
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
      <div className="flex justify-center items-center h-screen">
        <p>
          Vui Lòng{" "}
          <Link to="/login" className="text-cyan-500 hover:underline">
            đăng nhập
          </Link>{" "}
          để tiếp tục...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">DANH SÁCH SẢN PHẨM ĐÃ CHỌN</h1>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.product_id}-${item.size}`} className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="ml-0 sm:ml-4 mt-4 sm:mt-0 text-center sm:text-left">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.name} - {item.size}
                      </h2>
                      <p className="text-gray-600 mt-1">Giá: {formatPrice(item.price)}</p>
                      <div className="flex items-center justify-center sm:justify-start mt-2">
                        <p className="mr-2">Số Lượng:</p>
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              dispatch(decrementQuantity(item.product_id));
                            }
                          }}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>

                        <input
                          type="number"
                          value={item.quantity}
                          className="w-12 mx-2 text-center border-gray-300 rounded"
                          readOnly
                        />
                        <button
                          onClick={() => dispatch(incrementQuantity(item.product_id))}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeCart(item.product_id))}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">Giỏ hàng của bạn đang trống.</p>
            )}
          </div>

          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">TỔNG TIỀN</h2>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Tổng cộng:</p>
              <p className="text-xl font-bold text-gray-800">{formatPrice(getTotal().totalPrice)}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/payproducts"
              className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              Tiếp tục thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;