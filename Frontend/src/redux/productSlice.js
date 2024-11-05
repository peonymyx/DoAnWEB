import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import API from "./api";
import Swal from "sweetalert2";
import axios from "../utils/axios";

const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

export const addComment = createAsyncThunk(
  "comment/addComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/comment",
        commentData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (arg, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/v1/getProduct");
      console.log("Dữ liệu từ API:", res.data);
      return res.data.Product;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/v1/addProduct", payload);
      console.log(res.data);
      Swal.fire({
        icon: "success",
        title: "Add product successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/ProductManagement";
      return res.data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/v1/getProductById/${payload}`);
      console.log(res.data);
      return res.data.Product;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/v1/updateProduct/${data.id}`, data);
      Swal.fire({
        icon: "success",
        title: "Update product successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/ProductManagement";
      return res.data.product;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/api/v1/deleteProduct/${payload}`);
      console.log(res.data);
      Swal.fire({
        icon: "success",
        title: "Delete product successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      return res.data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products.push(action.payload.product);
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      // state.isLoading = false;
      // // console.log(current(state));

      // const index = state.products.findIndex(
      //   (product) => product._id === action.payload.product._id
      // );
      // console.log(index);
      // state.products.splice(index, 1);
      state.isLoading = false;

      console.log("Action payload:", action.payload); // Kiểm tra giá trị của action.payload

      if (!action.payload || !action.payload.product) {
        console.error("Invalid payload:", action.payload);
        return;
      }

      const index = state.products.findIndex(
        (product) => product._id === action.payload.product._id
      );
      console.log("Index to delete:", index);

      if (index !== -1) {
        state.products.splice(index, 1); // Xóa sản phẩm chỉ khi index hợp lệ
      }
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(getProductById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      const { id, description, dosage, image, maxAge, minAge, name, origin } =
        action.meta.arg;
      for (let i = 0; i < state.product.length; i++) {
        if (state.products[i]._id === id) {
          state.products[i].description = description;
          state.products[i].dosage = dosage;
          state.products[i].image = image;
          state.products[i].maxAge = maxAge;
          state.products[i].minAge = minAge;
          state.products[i].name = name;
          state.products[i].origin = origin;
        }
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const {
  addProductStart,
  addProductSuccess,
  addProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  UpdateProductSuccess,
  updateProductFailure,
} = productSlice.actions;

export default productSlice.reducer;
