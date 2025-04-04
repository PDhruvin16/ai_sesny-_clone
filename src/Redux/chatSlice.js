import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChatId: null,
  },
  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
    clearActiveChatId: (state) => {
      state.activeChatId = null;
    },
  },
});

export const { setActiveChatId, clearActiveChatId } = chatSlice.actions;
export default chatSlice.reducer;
