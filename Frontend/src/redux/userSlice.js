import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const token = Cookies.get("token");

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://doanweb-api.onrender.com/api/v1/getUsers", {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return res.data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRoleUser = createAsyncThunk(
  "user/updateRoleUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        "https://doanweb-api.onrender.com/api/v1/users/updateRole",
        payload,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data1 }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://doanweb-api.onrender.com/api/v1/updateUser/${id}`,
        data1,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Update user successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      return response.data.user;
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Update user failed!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/v1/getUserById/${id}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
        sessionStorage.setItem("user", JSON.stringify(action.payload));
        window.location.reload();
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateRoleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { role, id } = action.meta.arg;
        state.users = state.users.map((user) =>
          user._id === id ? { ...user, role } : user
        );
      })
      .addCase(updateRoleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
