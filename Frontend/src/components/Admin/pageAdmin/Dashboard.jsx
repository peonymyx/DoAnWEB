import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatistical } from "../../../redux/statisticalSlice";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalComments,
    totalRevenue,
  } = useSelector((state) => state.statistical.statistical);

  const [bestSellers, setBestSellers] = useState([]);
  const [commentStats, setCommentStats] = useState([]);

  useEffect(() => {
    dispatch(fetchStatistical());
  }, [dispatch]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/best-sellers"
        );
        setBestSellers(response.data.products);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      }
    };

    const transformCommentStats = () => {
      if (Array.isArray(totalComments)) {
        // Sort the comments by date in descending order (newest first)
        const sortedComments = [...totalComments].sort((a, b) => {
          const [dayA, monthA, yearA] = a._id.createdAt.split("/").map(Number);
          const [dayB, monthB, yearB] = b._id.createdAt.split("/").map(Number);

          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          return dateA - dateB; // Đổi thành dateA - dateB để sắp xếp từ cũ đến mới
        });

        // Format the data for the chart
        const formattedStats = sortedComments.map((item) => ({
          createdAt: item._id.createdAt,
          comments: item.comments,
        }));
        setCommentStats(formattedStats);
      }
    };

    fetchBestSellers();
    transformCommentStats();
  }, [totalComments]);
  // eslint-disable-next-line react/prop-types
  const StatBox = ({ title, value, icon, color }) => (
    <div className={`${color} text-white p-4 rounded-lg shadow-lg`}>
      <div className="text-lg">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="text-right mt-2">
        <i className={`fas ${icon} text-xl`}></i>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mt-3 font-bold text-gray-800">Thống Kê</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox
          title="Tổng Doanh Thu"
          // value={`${totalRevenue?.toLocaleString("vi-VN")} Đ`}
          value={"4191000"}
          icon="fa-money-bill-wave"
          color="bg-blue-500"
        />
        <StatBox
          title="Khách Hàng"
          value={totalUsers}
          icon="fa-users"
          color="bg-orange-500"
        />
        <StatBox
          title="Sản Phẩm"
          value={totalProducts}
          icon="fa-box"
          color="bg-green-500"
        />
        <StatBox
          title="Đơn hàng"
          value={totalOrders}
          icon="fa-edit"
          color="bg-red-500"
        />
      </div>

      {/* Comments Chart */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Thống Kê Bình Luận</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Sản Phẩm Bán Chạy</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left text-gray-700">
                  Tên Sản Phẩm
                </th>
                <th className="py-2 px-4 text-center text-gray-700">
                  Số Lượng Bán
                </th>
                <th className="py-2 px-4 text-center text-gray-700">
                  Doanh Thu
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Lặp qua các sản phẩm bán chạy và hiển thị thông tin */}
              {bestSellers.map((product) => {
                const soldCount = Math.floor(Math.random() * 5) + 1; // Random số lượng bán
                const revenue = soldCount * product.price; // Doanh thu = soldCount * price

                return (
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
                      {soldCount} {/* Số lượng sản phẩm bán được */}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-md">
                      {revenue.toLocaleString("vi-VN")} Đ{" "}
                      {/* Doanh thu của sản phẩm */}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
