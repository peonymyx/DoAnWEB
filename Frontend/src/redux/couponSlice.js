// redux/couponSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  coupons: [],
  discount: 0,
  isLoading: false,
  error: null,
};

// Create coupon
export const createCoupon = createAsyncThunk(
  'coupon/create',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/coupons', couponData);
      return response.data; // Return coupon data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all coupons
export const fetchCoupons = createAsyncThunk(
  'coupon/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/coupons');
      return response.data; // Return array of coupons
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update coupon
export const updateCoupon = createAsyncThunk(
  'coupon/update',
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
  'coupon/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/coupons/${id}`);
      return id; // Return coupon ID to delete
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Apply coupon
export const applyCoupon = createAsyncThunk(
  'coupon/apply',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/apply', { code });
      return response.data.discount; // Return discount value
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create slice
const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    resetDiscount: (state) => {
      state.discount = 0;
    },
  },
  extraReducers: (builder) => {
    // Create coupon
    builder.addCase(createCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons.push(action.payload);
    });
    builder.addCase(createCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch all coupons
    builder.addCase(fetchCoupons.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCoupons.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = action.payload;
    });
    builder.addCase(fetchCoupons.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update coupon
    builder.addCase(updateCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.coupons.findIndex(coupon => coupon._id === action.payload._id);
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    });
    builder.addCase(updateCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete coupon
    builder.addCase(deleteCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
    });
    builder.addCase(deleteCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Apply coupon
    builder.addCase(applyCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(applyCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.discount = action.payload; // Update discount
    });
    builder.addCase(applyCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { resetDiscount } = couponSlice.actions;
export default couponSlice.reducer;
