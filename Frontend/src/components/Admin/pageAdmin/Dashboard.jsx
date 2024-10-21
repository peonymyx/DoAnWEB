import { useDispatch, useSelector } from "react-redux";
import { fetchStatistical } from "../../../redux/statisticalSlice";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { totalUsers, totalProducts, totalOrders, totalRevenue } = useSelector(
    (state) => state.statistical.statistical
  );

  useEffect(() => {
    dispatch(fetchStatistical());
  }, [dispatch]);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-xl">Thống Kê</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* Statistic boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-blue-500 text-white p-4 rounded shadow-lg">
              <div className="text-lg">Tổng Doanh Thu</div>
              <div className="text-3xl font-bold mt-2">
                {totalRevenue?.toLocaleString("vi-VN")} Đ
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
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
