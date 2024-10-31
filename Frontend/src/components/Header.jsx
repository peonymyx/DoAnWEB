import { Link } from "react-router-dom";
import { logOut } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logOut());
  };
  const user = useSelector((state) => state.auth.currentUser);

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <header className="fixed top-0 left-0 w-full shadow-md sm:px-6 bg-white font-sans min-h-[50px] tracking-wide z-50">
      <div className="flex items-center justify-between w-full px-16">
        <Link to="/" className="flex-shrink-0">
          <img
            src="https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/12/06090103/logo-shop-qu%E1%BA%A7n-%C3%A1o-8.png"
            alt="logo"
            className="w-20 scale-125"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:w-auto">
          <ul className="lg:flex lg:gap-x-5">
            <li>
              <Link
                to={"/listproducts"}
                className="text-[#333] hover:text-[#007bff] block font-semibold text-2xl ml-40"
              >
                Sản Phẩm
              </Link>
            </li>
            <li>
              <Link
                href="javascript:void(0)"
                className="text-[#333] hover:text-[#007bff] block font-semibold text-2xl ml-14"
                to={"/fava"}
              >
                Sản Phẩm Yêu Thích
              </Link>
            </li>
            <li>
              <Link
                className="text-[#333] hover:text-[#007bff] block font-semibold text-2xl ml-14"
                to={"/cart"}
              >
                Giỏ hàng
              </Link>
            </li>
            <li>
              <Link
                to={"/my-order"}
                className="text-[#333] hover:text-[#007bff] block font-semibold text-2xl ml-14"
              >
                Đơn hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-6 relative">
          {user ? (
            <div className="flex">
              <img
                className="w-[40px] h-[40px] rounded-full"
                src={user?.avatar}
                alt=""
              />
              <div className="dropdown relative">
                <Link
                  className="nav-link text-black dropdown-toggle text-xl"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()} // Prevent default link behavior
                >
                  {user.username}
                </Link>
                {/* Dropdown Menu */}
                <ul className="dropdown-menu absolute hidden bg-white text-black shadow-lg">
                  <li>
                    <Link
                      className="dropdown-item text-lg p-3 py-2"
                      to={`/UpdateMain/${user._id}`}
                    >
                      Chỉnh Sửa Hồ Sơ
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLogOut}
                      to="#"
                      className="dropdown-item text-lg p-3 py-2"
                    >
                      Đăng Xuất
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <button className="font-semibold text-2xl border-none outline-none">
                <Link
                  to="/register"
                  className="text-[#007bff] hover:underline mr-4 text-xl px-3 py-2"
                >
                  Đăng Ký
                </Link>
              </button>
              <button className="mr-2 px-3 py-2 text-xl rounded-sm font-bold  text-white border-2 border-[#007bff] bg-[#007bff] transition-all ease-in-out duration-500 hover:bg-transparent hover:text-[#007bff]">
                <Link to="/login">Đăng Nhập</Link>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button and Buttons */}
        <div className="flex top-0 items-center space-x-4 lg:hidden">
          {user ? (
            <Link
              className="nav-link text-black dropdown-toggle text-lg"
              data-bs-toggle="dropdown"
              role="button"
            >
              {user.username}
            </Link>
          ) : (
            <div>
              <button className="font-semibold text-[15px] border-none outline-none">
                <Link
                  to="/register"
                  className="text-[#007bff] hover:underline mr-4 text-xl px-3 py-2"
                >
                  Đăng Ký
                </Link>
              </button>
              <button className="mr-2 px-3 py-2 text-xl rounded-sm font-bold  text-white border-2 border-[#007bff] bg-[#007bff] transition-all ease-in-out duration-500 hover:bg-transparent hover:text-[#007bff]">
                <Link to="/login">Đăng nhập</Link>
              </button>
            </div>
          )}
          {user ? (
            <ul>
              <li className="dropdown-menu">
                <Link
                  className="dropdown-item text-lg p-3 py-2"
                  to={`/UpdateMain/${user._id}`}
                >
                  Chỉnh Sửa Hồ Sơ
                </Link>
                <Link
                  onClick={handleLogOut}
                  to="#"
                  className="dropdown-item text-lg p-3 py-2"
                >
                  Đăng Xuất
                </Link>
              </li>
            </ul>
          ) : null}
          <button onClick={toggleMenu}>
            {menuVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="#333"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuVisible && (
        <div className="lg:hidden mt-4">
          <ul className="flex flex-col space-y-3">
            <li className="border-b py-3">
              <Link
                to={"/listproducts"}
                className="hover:text-[#007bff] text-[#333] block font-semibold text-xl"
              >
                Sản phẩm
              </Link>
            </li>
            <li className="border-b py-3">
              <Link
                to="/calendar"
                className="hover:text-[#007bff] text-[#333] block font-semibold text-xl"
              >
                Sản phẩm yêu thích
              </Link>
            </li>
            <li className="border-b py-3">
              <Link
                to={"/cart"}
                className="hover:text-[#007bff] text-[#333] block font-semibold text-xl"
              >
                Giỏ hàng
              </Link>
            </li>
            <li className="border-b py-3">
              <Link
                to={"/my-order"}
                className="hover:text-[#007bff] text-[#333] block font-semibold text-xl"
              >
                Đơn hàng
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
