import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Tìm sản phẩm có cùng ID VÀ cùng size
      const index = state.cart.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.size === action.payload.size
      );

      if (index >= 0) {
        // Nếu tìm thấy sản phẩm cùng ID và cùng size, tăng số lượng
        state.cart[index].quantity += 1;
      } else {
        // Nếu không tìm thấy, thêm sản phẩm mới với size đã chọn
        state.cart.push({ ...action.payload, quantity: 1 });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thêm thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    incrementQuantity: (state, action) => {
      // Tìm sản phẩm dựa trên product_id VÀ size
      const parts = action.payload.split("-");

      const productId = parts[0]; // Phần product_id
      const size = parts[1]; // Phần size

      const index = state.cart.findIndex(
        (item) => item.product_id === productId && item.size === size
      );

      if (index >= 0) {
        state.cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    decrementQuantity: (state, action) => {
      // Tìm sản phẩm dựa trên product_id VÀ size
      const parts = action.payload.split("-");

      const productId = parts[0]; // Phần product_id
      const size = parts[1]; // Phần size

      const index = state.cart.findIndex(
        (item) => item.product_id === productId && item.size === size
      );

      if (index >= 0) {
        if (state.cart[index].quantity > 1) {
          state.cart[index].quantity -= 1;
        }
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    removeCart: (state, action) => {
      // Tìm và xóa sản phẩm dựa trên product_id VÀ size
      const parts = action.payload.split("-");
      console.log(parts);

      const productId = parts[0]; // Phần product_id
      const size = parts[1]; // Phần size

      const index = state.cart.findIndex(
        (item) => item.product_id === productId && item.size === size
      );

      if (index >= 0) {
        state.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, removeCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state) => state.cart.cart;
