import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const getall = createAsyncThunk(
  'ProductOfferingCatalog/getall',
  async (_, { rejectWithValue }) => {
    try {      
      const access_token = localStorage.getItem('access_token');
      const response = await axios.get("/api/product-offering-catalog", {
        headers: { authorization: access_token },
      });
      return response.data.result || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getOne = createAsyncThunk(
  'ProductOfferingCatalog/getOne',
  async (id, { rejectWithValue }) => {
    try {      
      const access_token = localStorage.getItem('access_token');
      const response = await axios.get(`/api/product-offering-catalog/${id}`, {
        headers: { authorization: access_token },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCatalog = createAsyncThunk(
  'ProductOfferingCatalog/create',
  async (productData, { rejectWithValue }) => {
    try {
      const access_token = localStorage.getItem('access_token');
      const response = await axios.post("/api/product-offering-catalog", productData, {
        headers: { authorization: access_token },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCatalogStatus = createAsyncThunk(
  'ProductOfferingCatalog/updateStatus', // Fixed action type prefix
  async ({ id, currentStatus }, { rejectWithValue }) => {
    try {
      const access_token = localStorage.getItem('access_token'); // Added access_token
      const newStatus = currentStatus === 'draft' ? 'published' 
                      : currentStatus === 'published' ? 'retired'
                      : currentStatus;

      const response = await axios.patch(
        `/api/product-offering-catalog/${id}`, 
        { status: newStatus },
        { headers: { authorization: access_token } } // Added headers
      );
      
      return response.data.result; // Fixed response data structure
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message); // Consistent error handling
    }
  }
);

export const updateCatalog = createAsyncThunk(
  'ProductOfferingCatalog/update',
  async ({ id, ...productData }, { rejectWithValue }) => {
    try {
      const access_token = localStorage.getItem('access_token');
      const response = await axios.patch(`/api/product-offering-catalog/${id}`, productData, {
        headers: { authorization: access_token },
      });
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCatalog = createAsyncThunk(
  'ProductOfferingCatalog/delete',
  async (id, { rejectWithValue }) => {
    try {
      const access_token = localStorage.getItem('access_token');
      await axios.delete(`/api/product-offering-catalog/${id}`, {
        headers: { authorization: access_token },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const ProductOfferingCatalogSlice = createSlice({
  name: 'ProductOfferingCatalog',
  initialState: { 
    data: [],
    selectedProduct: null,
    loading: true,
    error: null
  },
  extraReducers: (builder) => {
    builder
      // getall
      .addCase(getall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getall.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getall.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // getOne
      .addCase(getOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOne.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(getOne.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // createCatalog
      .addCase(createCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCatalog.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(createCatalog.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // updateCatalogStatus
      .addCase(updateCatalogStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCatalogStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCatalogStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // updateCatalog
      .addCase(updateCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCatalog.fulfilled, (state, action) => {
        const index = state.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCatalog.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // deleteCatalog
      .addCase(deleteCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCatalog.fulfilled, (state, action) => {
        state.data = state.data.filter(p => p.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCatalog.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default ProductOfferingCatalogSlice.reducer;