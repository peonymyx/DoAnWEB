import { useDispatch, useSelector } from "react-redux"; // Hook để kết nối với Redux store
import { fetchStatistical } from "../../../redux/statisticalSlice"; // Action fetch thống kê từ Redux
import { useEffect, useState } from "react"; // Các hook của React: useEffect để xử lý side effect, useState để quản lý state
import axios from "axios"; // Thư viện Axios để thực hiện các yêu cầu HTTP
import { motion } from "framer-motion"; // Thư viện Framer Motion để thêm hiệu ứng động

const Dashboard = () => {
  // Sử dụng dispatch để gọi các actions và useSelector để lấy dữ liệu từ Redux store
  const dispatch = useDispatch();

  // Lấy dữ liệu thống kê từ Redux store
  const { totalUsers, totalProducts, totalOrders, totalRevenue } = useSelector(
    (state) => state.statistical.statistical
  );

  // useEffect để gọi fetchStatistical khi component được render lần đầu
  useEffect(() => {
    dispatch(fetchStatistical());
  }, [dispatch]);

  // Khai báo state để lưu trữ các sản phẩm bán chạy
  const [bestSellers, setBestSellers] = useState([]);

  // useEffect để lấy dữ liệu sản phẩm bán chạy từ API
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Thực hiện gọi API để lấy danh sách sản phẩm bán chạy
        const response = await axios.get(
          "https://doanweb-api.onrender.com/api/v1/best-sellers"
        );
        // Cập nhật state với dữ liệu sản phẩm bán chạy
        setBestSellers(response.data.products);
      } catch (err) {
        console.error("Error fetching best sellers:", err); // Xử lý lỗi nếu gọi API thất bại
      }
    };

    fetchBestSellers(); // Gọi hàm lấy sản phẩm bán chạy
  }, []); // useEffect này chỉ chạy một lần khi component được mount

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-2xl mb-3">Thống Kê</h1>{" "}
              {/* Tiêu đề của trang thống kê */}
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* Các hộp thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Hộp tổng doanh thu */}
            <div className="bg-blue-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Tổng Doanh Thu</div>
              <div className="text-3xl font-bold mt-2">
                {/* Hiển thị tổng doanh thu, sử dụng toLocaleString để định dạng số tiền */}
                {totalRevenue?.toLocaleString("vi-VN")} Đ
              </div>
              <div className="text-right mt-2">
                <i className="fas fa-money-bill-wave text-xl"></i>{" "}
                {/* Biểu tượng tiền */}
              </div>
            </div>

            {/* Hộp tổng số khách hàng */}
            <div className="bg-orange-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Khách Hàng</div>
              <div className="text-3xl font-bold mt-2">
                {/* Hiển thị tổng số khách hàng */}
                {totalUsers}
              </div>
              <div className="text-right mt-2">
                <i className="fas fa-users text-xl"></i>{" "}
                {/* Biểu tượng người dùng */}
              </div>
            </div>

            {/* Hộp tổng số sản phẩm */}
            <div className="bg-green-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Sản Phẩm</div>
              <div className="text-3xl font-bold mt-2">
                {/* Hiển thị tổng số sản phẩm */}
                {totalProducts}
              </div>
              <div className="text-right mt-2">
                <i className="fas fa-box text-xl"></i>{" "}
                {/* Biểu tượng hộp sản phẩm */}
              </div>
            </div>

            {/* Hộp tổng số đơn hàng đang chờ duyệt */}
            <div className="bg-red-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Đang Chờ Duyệt</div>
              <div className="text-3xl font-bold mt-2">
                {/* Hiển thị tổng số đơn hàng đang chờ duyệt */}
                {totalOrders}
              </div>
              <div className="text-right mt-2">
                <i className="fas fa-edit text-xl"></i>{" "}
                {/* Biểu tượng sửa đổi */}
              </div>
            </div>
          </div>

          {/* Tiêu đề cho danh sách sản phẩm bán chạy */}
          <h1 className="text-2xl mb-4 mt-10">Sản Phẩm Bán Chạy</h1>

          {/* Bảng sản phẩm bán chạy */}
          <div className="bg-white shadow-md rounded pt-2 pb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-center text-lg">
                      Tên Sản Phẩm {/* Tiêu đề cột tên sản phẩm */}
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lg">
                      Số Lượng Bán {/* Tiêu đề cột số lượng bán */}
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lg">
                      Doanh Thu {/* Tiêu đề cột doanh thu */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Lặp qua các sản phẩm bán chạy và hiển thị thông tin */}
                  {bestSellers.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 50 }} // Hiệu ứng động ban đầu
                      animate={{ opacity: 1, y: 0 }} // Hiệu ứng động khi xuất hiện
                      transition={{ duration: 0.5 }} // Thời gian chuyển động
                      className="hover:bg-gray-100" // Hiệu ứng hover (di chuột vào sẽ đổi màu nền)
                    >
                      <td className="py-2 px-4 border-b">{product.name}</td>{" "}
                      {/* Tên sản phẩm */}
                      <td className="py-2 px-4 border-b text-center text-md">
                        {product.soldCount} {/* Số lượng sản phẩm bán được */}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-md">
                        {/* Doanh thu của sản phẩm (có thể hiển thị ở đây nếu cần) */}
                        {/* {product.revenue.toLocaleString("vi-VN")} Đ */}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
