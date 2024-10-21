import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Nav/Sidebar";
import { useSelector } from "react-redux";

const LayoutAdmin = () => {
  const auth = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.role !== "admin" && auth?.role !== "nhanvien") {
      window.location.href = "/";
    }
  }, [auth, navigate]);

  if (auth?.role !== "admin" && auth?.role !== "nhanvien") {
    return null;
  }

  return (
    <div className="wrapper flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Sidebar Component */}
      <div className="flex-1 lg:ml-72 p-8 mt-12 overflow-x-auto">
        <Outlet /> {/* Placeholder for nested routes */}
      </div>
    </div>
  );
};

export default LayoutAdmin;
