// Import các thư viện cần thiết để sử dụng
import { yupResolver } from "@hookform/resolvers/yup"; // Thêm yupResolver cho yup để xác thực biểu mẫu với react-hook-form
import * as yup from "yup"; // Import yup để tạo schema xác thực
import { useForm } from "react-hook-form"; // Import useForm để quản lý trạng thái biểu mẫu
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch và useSelector để sử dụng Redux
import "./loading.css"; // Import file CSS cho hiệu ứng tải
import { addProduct } from "../../../redux/productSlice"; // Import action addProduct để thêm sản phẩm
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển trang
import { useEffect, useState } from "react"; // Import useEffect và useState để quản lý trạng thái
import { getCategory } from "../../../redux/categorySlice"; // Import getCategory để lấy danh mục sản phẩm
import ReactQuill from "react-quill"; // Import ReactQuill để dùng editor cho mô tả sản phẩm
import "react-quill/dist/quill.snow.css"; // Import CSS cho ReactQuill
import { handleUploadToImgBB } from "../../../config/apiConfig"; // Import hàm tải ảnh lên ImgBB

// Xác định schema xác thực với yup để kiểm tra tên và giá của sản phẩm
const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"), // Tên sản phẩm không được bỏ trống
  price: yup.string().required("Vui lòng nhập giá"), // Giá sản phẩm không được bỏ trống
});

const AddProduct = () => {
  const [imageUpload, setImageUpload] = useState(null); // Trạng thái lưu ảnh sản phẩm tải lên
  const [description, setDescription] = useState(""); // Trạng thái lưu mô tả sản phẩm
  const [selectedSize, setSelectedSize] = useState([]); // Trạng thái lưu các kích cỡ sản phẩm đã chọn
  const isLoading = useSelector((state) => state.product.isLoading); // Trạng thái tải từ Redux
  const {
    register,
    handleSubmit,
    formState: { errors }, // Trạng thái lỗi của biểu mẫu
  } = useForm({
    resolver: yupResolver(schema), // Sử dụng yup để xác thực biểu mẫu
  });
  const dispatch = useDispatch(); // Hàm để dispatch các action
  const user = JSON.parse(sessionStorage.getItem("user")); // Lấy thông tin người dùng từ session
  const category = useSelector((state) => state.category.category); // Lấy danh mục sản phẩm từ Redux
  const navigate = useNavigate(); // Hàm điều hướng

  // Kiểm tra quyền admin khi tải trang
  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/login"); // Nếu không phải admin, chuyển về trang đăng nhập
    }
  }, [user.role, navigate]);

  // Gọi API để lấy danh mục sản phẩm khi component được mount
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  // Hàm xử lý tải ảnh sản phẩm
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setImageUpload(file); // Lưu file ảnh vào trạng thái
  };

  // Hàm xử lý thêm kích cỡ sản phẩm
  const handleAddSize = (size) => {
    setSelectedSize(
      (prevSelectedSize) =>
        prevSelectedSize.includes(size)
          ? prevSelectedSize.filter((s) => s !== size) // Bỏ kích cỡ nếu đã chọn
          : [...prevSelectedSize, size] // Thêm kích cỡ mới
    );
  };

  // Hàm xử lý khi gửi biểu mẫu thêm sản phẩm
  const handleAddProduct = async (data) => {
    const { name, category, price } = data;
    console.log("Form data:", data);
    console.log("Image file:", imageUpload);

    if (!imageUpload) {
      console.error("No image file selected");
      return; // Nếu không có ảnh, ngừng tiến trình
    }

    // Tải ảnh lên và lấy URL ảnh
    const imageUrl = await handleUploadToImgBB(imageUpload);

    if (!imageUrl) {
      console.error("Failed to upload image");
      return; // Nếu tải ảnh thất bại, ngừng tiến trình
    }

    // Gửi sản phẩm mới lên Redux
    await dispatch(
      addProduct({
        name,
        size: selectedSize.join(","), // Chuyển danh sách kích cỡ thành chuỗi
        category,
        description,
        price,
        image: imageUrl,
      })
    );

    // Chuyển hướng đến trang quản lý sản phẩm
    navigate("/ProductManagement");
  };

  return (
    <div className="flex h-[100vh]">
      <div className="container min-h-screen mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="font-bold text-3xl text-center mb-6">Thêm Sản Phẩm</h1>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <form
            onSubmit={handleSubmit(handleAddProduct)}
            className="max-w-md mx-auto"
            encType="multipart/form-data"
          >
            {/* Nhập tên sản phẩm */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Tên sản phẩm:
              </label>
              <input
                name="name"
                type="text"
                id="name"
                placeholder="Hãy nhập tên sản phẩm"
                className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                {...register("name")}
              />
              <p className="text-red-500 mt-1">{errors.name?.message}</p>
            </div>

            {/* Nhập giá sản phẩm */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Giá sản phẩm:
              </label>
              <input
                name="price"
                type="text"
                id="price"
                placeholder="Hãy nhập giá sản phẩm"
                className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                {...register("price")}
              />
              <p className="text-red-500 mt-1">{errors.price?.message}</p>
            </div>

            {/* Chọn kích cỡ sản phẩm */}
            <div className="flex gap-2 items-center mt-2 mb-4">
              <label
                htmlFor="size"
                className="block font-bold text-[#07074D] text-xl"
              >
                Chọn Size:
              </label>
              {selectedSize.map((size) => (
                <div
                  key={size}
                  className="border px-4 py-2 cursor-pointer size-item active border-primary"
                >
                  {size}
                </div>
              ))}
            </div>

            {/* Hiển thị lựa chọn kích cỡ */}
            <div className="flex gap-2 items-center mt-2 text-xl">
              <button
                type="button"
                onClick={() => handleAddSize("S")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("S") ? "bg-blue-500 text-white" : ""
                }`}
              >
                S
              </button>
              <button
                type="button"
                onClick={() => handleAddSize("M")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("M") ? "bg-blue-500 text-white" : ""
                }`}
              >
                M
              </button>
              <button
                type="button"
                onClick={() => handleAddSize("L")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("L") ? "bg-blue-500 text-white" : ""
                }`}
              >
                L
              </button>
              <button
                type="button"
                onClick={() => handleAddSize("XL")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("XL") ? "bg-blue-500 text-white" : ""
                }`}
              >
                XL
              </button>
            </div>

            {/* Chọn danh mục sản phẩm */}
            <div className="my-4">
              <label
                htmlFor="category"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Danh mục
              </label>
              <select
                className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                name="category"
                {...register("category")}
              >
                {category.map((cate) => (
                  <option key={cate._id} value={cate._id}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tải ảnh lên */}
            <div className="mb-4">
              <label className="block font-bold text-xl text-[#07074D]">
                Hình ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input w-full max-w-xs"
                onChange={handleUploadImage}
              />
            </div>

            {/* Nhập mô tả sản phẩm */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Mô tả:
              </label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="w-full h-40"
              />
            </div>

            {/* Nút thêm sản phẩm */}
            <button
              className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-700 transition duration-300"
              type="submit"
            >
              Thêm sản phẩm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
