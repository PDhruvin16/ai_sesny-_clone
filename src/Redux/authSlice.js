import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.62:6004/user/login', {
        email,
        password,
      });
      console.log('Response=====>>>>>>',response);
      
    //   const { token } = response?.data;
      // const { token } = response?.data?.result;
      const { token, role } = response?.data?.result;
      // Save token to AsyncStorage
      await AsyncStorage.setItem('token', token);

      return { token ,role };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    loading: false,
    error: null,
    role: null,
  },
  reducers: {
  logout: (state) => {
    state.token = null;
    state.role = null;
    state.name = null;
    state.managedBy = null;

    AsyncStorage.multiRemove(['token', 'role', 'name', 'managedBy']);
  },
},

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;