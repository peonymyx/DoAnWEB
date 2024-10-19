import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../redux/categorySlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./loading.css";
import Sidebar from "../../Nav/Sidebar";
import { Link } from "react-router-dom";

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
    dispatch(addCategory(data));
  };

  return (
    <div className="flex h-[100vh]">
      <div className="min-h-screen mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[500px] p-4 bg-gray-100 mt-40 rounded-lg shadow"
        >
          <h1 className="text-3xl font-bold text-center pb-4">Thêm danh mục</h1>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <div className="mb-4">
            <label className="mb-3 block font-bold text-[#07074D] text-xl">
              Mã số
            </label>
            <input
              type="text"
              className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              {...register("slug")}
            />
            <p className="text-red-500 mt-3 text-lg">{errors.slug?.message}</p>
          </div>
          <div className="mb-4">
            <label className="mb-3 block font-bold text-[#07074D] text-xl">
              Tên danh mục:
            </label>

            <div>
              <input
                type="text"
                className={`w-full rounded-md border text-xl bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                  errors.name ? "border-red-500" : "border-[#e0e0e0]"
                } focus:outline-none`}
                {...register("name")}
              />
              <p className="text-red-500 mt-3 text-lg">
                {errors.name?.message}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <Link to="/category" className="mt-3 text-lg py-3 px-6">
              Quay Lại
            </Link>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-lg text-white font-bold py-3 px-6 mt-3 rounded focus:outline-none focus:shadow-outline"
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
