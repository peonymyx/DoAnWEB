import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../redux/userSlice";
import "../cruds/loading.css";
import Footer from "../../post/Footer";

const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên"),
  phone: yup.string().required("Vui lòng nhập số điện thoại"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
});

const UpdateMain = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      dispatch(getUserById(id));
    };
    getUser();
  }, [dispatch, id]);
  // const user = useSelector((state) => state.auth.currentUser);
  const user = useSelector((state) => state.auth.currentUser);
  // const user = useSelector((state) => state.user.users);
  console.log(user);
  const isLoading = useSelector((state) => state.user.isLoading);
  const [username, setUsername] = useState(user?.username);
  const [phone, setPhone] = useState(user?.phone);
  const [gender, setGender] = useState(user?.gender);
  const [age, setAge] = useState(user?.age);
  const [address, setAddress] = useState(user?.address);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [preview, setPreview] = useState(user?.avatar); // state để lưu URL preview

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // tạo URL tạm thời để preview ảnh
    }
  };

  const handleUpdateUser = async (data) => {
    const data1 = {
      ...data,
      avatar: avatar ? avatar : user?.avatar,
    };
    dispatch(updateUser({ id, data1 }));
  };

  useEffect(() => {
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null;
  }, [dispatch]);

  return (
    <div>
      <div className="container mt-28 max-w-[550px]">
        <form
          onSubmit={handleSubmit(handleUpdateUser)}
          className="container-fluid bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          encType="multipart/form-data"
        >
          <h1 className="text-3xl mb-3">Cập Nhật Thông Tin</h1>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <div className="mb-4">
            <label
              className="mb-3 block font-bold text-[#07074D] text-xl"
              htmlFor="username"
            >
              Tên
            </label>
            <input
              className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              type="text"
              id="name"
              {...register("username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="text-red-500 mt-1">{errors.username?.message}</p>
          </div>
          <div className="mb-4">
            <label
              className="mb-3 block font-bold text-[#07074D] text-xl"
              htmlFor="phone"
            >
              Số điện thoại
            </label>
            <input
              className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              type="text"
              id="phone"
              {...register("phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-red-500 mt-1">{errors.phone?.message}</p>
          </div>
          <div className="mb-4">
            <label
              className="mb-3 block font-bold text-[#07074D] text-xl"
              htmlFor="gender"
            >
              Giới tính
            </label>
            <select
              className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              id="gender"
              {...register("gender")}
            >
              <option
                selected="selected"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                Chọn giới tính
              </option>
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
            </select>
            <p className="text-red-500 mt-1">{errors.gender?.message}</p>
          </div>
          <div className="mb-4">
            <label
              className="mb-3 block font-bold text-[#07074D] text-xl"
              htmlFor="dateOfBirth"
            >
              Ngày sinh
            </label>
            <input
              className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              type="date"
              id="dateOfBirth"
              {...register("age")}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-3 block font-bold text-[#07074D] text-xl"
              htmlFor="address"
            >
              Địa chỉ
            </label>
            <input
              className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              type="text"
              id="address"
              {...register("address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-red-500 mt-1">{errors.address?.message}</p>
          </div>
          <div className="mb-4">
            <label
              className="mb-3 block font-bold text-[#07074D] text-xl"
              htmlFor="avatar"
            >
              Ảnh đại diện
            </label>
            <input
              onChange={handleSelectFile}
              className="appearance-none w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              type="file"
              accept="image/*"
            />
            {preview && (
              <img
                className="w-[50px] h-[50px] rounded-full mt-2 object-cover"
                src={preview}
                alt="Avatar preview"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 mx-auto hover:bg-blue-700 text-lg text-white font-bold py-3 px-6 mt-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cập nhật thông tin
            </button>
          </div>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UpdateMain;
