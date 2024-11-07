import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/forgotpassword",
        { email },
        headers
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Hoàn thành",
          text: "Đã gửi về email thành công",
        });
        setEmail("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Gửi về email thất bại ",
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi không mong muốn",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-[480px]">
      <div
        className="p-4 border border-gray-200 rounded-full max-w-[400px] flex items-center"
        aria-label="form-send-email"
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <div className="flex-1">
          <input
            type="text"
            className="w-full pl-4 pr-16 text-xl text-black bg-transparent outline-none placeholder:text-black"
            placeholder="Nhập email của bạn"
            onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
