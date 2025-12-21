import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_USER_INFO } from "../constants";
import { getLocalStorageItem } from "../../../utils/main/getLocalStorageItem";

const initialState = {
  userInfo: getLocalStorageItem(LOCAL_STORAGE_USER_INFO),
  token: getLocalStorageItem(LOCAL_STORAGE_TOKEN),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const data = action.payload;
      state.userInfo = data?.user;
      state.token = data.access_token;

      localStorage.setItem(LOCAL_STORAGE_USER_INFO, JSON.stringify(data?.user));
      localStorage.setItem(
        LOCAL_STORAGE_TOKEN,
        JSON.stringify(data.access_token)
      );
    },

    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
