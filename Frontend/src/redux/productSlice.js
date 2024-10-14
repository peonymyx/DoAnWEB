import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import API from "./api";
import Swal from "sweetalert2";

const initialState = {
  product: [],
  isLoading: false,
  error: null,
};

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ( { rejectWithValue }) => {
    try {
      const res = await API.get("/api/v1/getProduct");
      return res.data.product;
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
      return res.data.product;
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
      state.product = action.payload;
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
      state.product.push(action.payload.product);
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      // console.log(current(state));

      const index = state.product.findIndex(
        (product) => product._id === action.payload.product._id
      );
      console.log(index);
      state.product.splice(index, 1);
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
      state.product = action.payload;
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
        if (state.product[i]._id === id) {
          state.product[i].description = description;
          state.product[i].dosage = dosage;
          state.product[i].image = image;
          state.product[i].maxAge = maxAge;
          state.product[i].minAge = minAge;
          state.product[i].name = name;
          state.product[i].origin = origin;
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
