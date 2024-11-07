import { useDispatch, useSelector } from "react-redux";
import { fetchStatistical } from "../../../redux/statisticalSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Dashboard = () => {
  // const dispatch = useDispatch();
  const dispatch = useDispatch();
  const { totalUsers, totalProducts, totalOrders, totalRevenue } = useSelector(
    (state) => state.statistical.statistical
  );

  useEffect(() => {
    dispatch(fetchStatistical());
  }, [dispatch]);

  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          "https://doanweb-api.onrender.com/api/v1/best-sellers"
        );
        setBestSellers(response.data.products);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-2xl mb-3">Thống Kê</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* Statistic boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Revenue */}
            <div className="bg-blue-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Tổng Doanh Thu</div>
              <div className="text-3xl font-bold mt-2">
                {/* {totalRevenue?.toLocaleString("vi-VN")} Đ */}
              </div>
              <div className="text-right mt-2">
                <i className="fas fa-money-bill-wave text-xl"></i>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-orange-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Khách Hàng</div>
              <div className="text-3xl font-bold mt-2">{totalUsers}</div>
              <div className="text-right mt-2">
                <i className="fas fa-users text-xl"></i>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-green-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Sản Phẩm</div>
              <div className="text-3xl font-bold mt-2">{totalProducts}</div>
              <div className="text-right mt-2">
                <i className="fas fa-box text-xl"></i>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-red-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Đang Chờ Duyệt</div>
              <div className="text-3xl font-bold mt-2">{totalOrders}</div>
              <div className="text-right mt-2">
                <i className="fas fa-edit text-xl"></i>
              </div>
            </div>
          </div>
          <h1 className="text-2xl mb-4 mt-10">Sản Phẩm Bán Chạy</h1>
          {/* Best Sellers Table */}
          <div className="bg-white shadow-md rounded pt-2 pb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-center text-lg">
                      Tên Sản Phẩm
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lg">
                      Số Lượng Bán
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lg">
                      Doanh Thu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="hover:bg-gray-100"
                    >
                      <td className="py-2 px-4 border-b">{product.name}</td>
                      <td className="py-2 px-4 border-b text-center text-md">
                        {product.soldCount}
                      </td>
                      <td className="py-2 px-4 border-b text-center text-md">
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
