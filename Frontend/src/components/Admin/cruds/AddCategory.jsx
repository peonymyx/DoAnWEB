import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../redux/categorySlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./loading.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  slug: yup.string().required("Vui lòng nhập mã số!"),
  name: yup.string().required("Vui lòng nhập tên danh mục!"),
});

function AddCategory() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const isLoading = useSelector((state) => state.category.isLoading);

  // Xử lý khi người dùng submit form
  const onSubmit = (data) => {
    dispatch(addCategory(data)).then(() => {
      Swal.fire({
        title: "Thành công",
        text: "Danh mục đã được thêm thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };

  return (
    <div className="h-[80vh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-gray-100 rounded-lg shadow p-4 md:p-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center pb-4">
            Thêm danh mục
          </h1>

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 md:mb-3 block font-bold text-[#07074D] text-lg md:text-xl">
              Mã số
            </label>
            <input
              type="text"
              className="w-full rounded-md border text-base md:text-xl border-[#e0e0e0] bg-white py-2 md:py-3 px-4 md:px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              {...register("slug")}
            />
            <p className="text-red-500 mt-2 text-base md:text-lg">
              {errors.slug?.message}
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 md:mb-3 block font-bold text-[#07074D] text-lg md:text-xl">
              Tên danh mục:
            </label>
            <div>
              <input
                type="text"
                className={`w-full rounded-md border text-base md:text-xl bg-white py-2 md:py-3 px-4 md:px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                  errors.name ? "border-red-500" : "border-[#e0e0e0]"
                }`}
                {...register("name")}
              />
              <p className="text-red-500 mt-2 text-base md:text-lg">
                {errors.name?.message}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              to="/category"
              className="text-base md:text-lg py-2 md:py-3 px-4 md:px-6 text-blue-500 hover:text-blue-700"
            >
              Quay Lại
            </Link>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-base md:text-lg text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
