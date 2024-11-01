import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, updateProduct } from "../../../redux/productSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategory } from "../../../redux/categorySlice";
import "./loading.css";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"),
});

const EditProduct = () => {
  const category = useSelector((state) => state.category.category);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.product.products);
  const isLoading = useSelector((state) => state.product.isLoading);
  const [selectedSize, setSelectedSize] = useState([]);
  const [imageUpload, setImageUpload] = useState("");
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getCategory());
  }, [dispatch, id]);

  useEffect(() => {
    if (product && typeof product.size === "string") {
      setSelectedSize(product.size.split(","));
    }
  }, [product]);

  const handleToggleSize = (size) => {
    if (selectedSize.includes(size)) {
      setSelectedSize(selectedSize.filter((s) => s !== size));
    } else {
      setSelectedSize([...selectedSize, size]);
    }
  };

  const handleSelectImage = async (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleEditProduct = (data) => {
    const { name, description, category, price } = data;
    const updatedProduct = {
      id,
      name: name !== undefined ? name : product.name,
      description:
        description !== undefined ? description : product.description,
      size: selectedSize.length > 0 ? selectedSize.join(",") : product.size,
      category: category !== undefined ? category : product.category,
      price: price !== undefined ? price : product.price,
      image: imageUpload ? imageUpload : product.image,
    };

    console.log("Updated Product Data:", updatedProduct);

    dispatch(updateProduct(updatedProduct)).then(() => {
      Swal.fire({
        title: "Success",
        text: "Product updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/ProductManagement");
      });
    });
  };

  return (
    <div className="flex h-[100vh]">
      <div className="container flex justify-center overflow-y-scroll p-4">
        <div className="h-max w-full max-w-[60rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <h1 className="font-bold text-3xl text-center mb-9">
            Cập nhật Sản Phẩm
          </h1>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <form
            onSubmit={handleSubmit(handleEditProduct)}
            className="w-full max-w-[60rem]"
            encType="multipart/form-data"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Tên sản phẩm:
              </label>
              <input
                name="name"
                type="text"
                placeholder="Hãy nhập tên sản phẩm"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.name}
                {...register("name")}
              />
              <p className="text-red-500 mt-1">{errors.name?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Giá
              </label>
              <input
                name="price"
                type="text"
                placeholder="Hãy nhập giá"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.price}
                {...register("price")}
              />
              <p className="text-red-500 mt-1">{errors.price?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="size"
                className="text-lg text-gray-60 mb-30 font-semibold mb-3"
              >
                Chọn Size:
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <div
                    key={size}
                    className={`border p-3 cursor-pointer size-item ${
                      selectedSize.includes(size) ? "border-primary" : ""
                    }`}
                    onClick={() => handleToggleSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Danh mục
              </label>
              <select
                name="category"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.category}
                {...register("category")}
              >
                {category.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="text-lg text-gray-600 font-semibold mb-4"
              >
                Hình ảnh:
              </label>
              {product?.image && (
                <img
                  src={product.image}
                  alt="Product"
                  className="w-[200px] h-[200px] p-2 mt-4"
                />
              )}
              <input
                type="file"
                {...register("image")}
                onChange={handleSelectImage}
                className="mt-4"
              />
              <p className="text-red-500 mt-1">{errors.image?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Mô tả
              </label>
              <textarea
                name="description"
                placeholder="Nhập mô tả"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.description}
                {...register("description")}
              />
              <p className="text-red-500 mt-1">{errors.description?.message}</p>
            </div>
            <div className="flex justify-between">
              <Link to="/ProductManagement" className="mt-3 text-lg py-3 px-6">
                Quay Lại
              </Link>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-lg text-white font-bold py-3 px-6 mt-3 rounded focus:outline-none focus:shadow-outline"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
