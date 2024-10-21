import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const handleSubmit = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/resetpassword",
        { token, password },
        headers
      );
      console.log(res);
      Swal.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công",
        text: "Vui lòng đăng nhập để tiếp tục",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Đổi mật khẩu thất bại",
        footer: "<a href>Bạn đang gặp vấn đề?</a>",
      });
    }
  };
  return (
    <div className="flex items-center justify-center h-[480px]">
      <div
        className="py-2 px-4 border border-gray-200 rounded-full max-w-[400px] mx-auto mt-20 flex items-center gap-x-5"
        aria-label="form-send-password"
      >
        <div className="flex-1">
          <input
            type="password"
            className="w-full text-lg text-black bg-transparent outline-none placeholder:text-black"
            placeholder="Nhập mật khẩu mới..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <span
          onClick={handleSubmit}
          className="flex-shrink-0 rotate-45 cursor-pointer mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ResetPassword;
