import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/authSlice";
import {
  HomeIcon,
  ShoppingBagIcon,
  ChatBubbleOvalLeftIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Manage sidebar open/close state
  const auth = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar
  };

  const handleLogOut = () => {
    dispatch(logOut());
    window.location.href = "/";
  };

  // NavItem component to handle each sidebar link
  // eslint-disable-next-line react/prop-types
  const NavItem = ({ to, icon: Icon, text }) => (
    <li>
      <Link
        to={to}
        className="flex items-center p-2 text-white hover:bg-blue-800 rounded-lg"
        onClick={() => setIsOpen(false)} // Close sidebar on item click
      >
        <Icon className="h-6 w-6" />
        <span className="ml-3">{text}</span>
      </Link>
    </li>
  );

  return (
    <div>
      {/* Mobile toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        {isOpen ? (
          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-blue-800 rounded-lg p-2 ml-[190px] mt-[8px]"
            aria-label="Toggle Sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="text-white bg-gray-300 border-gray-500 border hover:bg-blue-800 rounded-lg p-2 ml-3"
            aria-label="Toggle Sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-blue-900 w-72 fixed top-0 bottom-0 z-30 transition-transform duration-300 ease-in-out overflow-y-auto 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Menu Items */}
          <div className="px-3 py-4">
            <ul className="space-y-6 text-xl">
              {/* Trang chủ Button */}
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-white hover:bg-blue-800 rounded-lg"
                  onClick={() => setIsOpen(false)} // Close sidebar on item click
                >
                  <HomeIcon className="h-6 w-6" />
                  <span className="ml-3">Trang chủ</span>
                </Link>
              </li>
              <NavItem to="/dashBoard" icon={ChartBarIcon} text="Thống Kê" />
              <NavItem to="/category" icon={TagIcon} text="Danh Mục Sản Phẩm" />
              <NavItem
                to="/ProductManagement"
                icon={MedicalInformationIcon}
                text="Quản Lý Sản Phẩm"
              />
              <NavItem
                to="/otherManagement"
                icon={ShoppingBagIcon}
                text="Quản Lý Đơn Hàng"
              />
              <NavItem
                to="/mess"
                icon={ChatBubbleOvalLeftIcon}
                text="Tin Nhắn"
              />
              <NavItem
              to="/CouponManage"
              icon = {HomeIcon}
              text= "Coupon"/>
              <NavItem
                to="/commentManagement"
                icon={HomeIcon}
                text="Bình Luận"
              />
              {auth.role === "admin" && (
                <NavItem
                  to="/AccountManagement"
                  icon={UserIcon}
                  text="Quản Lý Tài Khoản"
                />
              )}
            </ul>
          </div>

          {/* Footer with Logout Button */}
          <div className="p-4">
            <div className="flex justify-center items-center">
              <button
                onClick={handleLogOut}
                className="flex items-center text-white bg-red-400 hover:bg-red-700 p-2 rounded-lg"
              >
                <span className="mr-2">Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay to close the sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
