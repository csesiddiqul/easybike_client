import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_THEME } from "../constants";

const themeSlice = createSlice({
  name: LOCAL_STORAGE_THEME,
  initialState: {
    mode: localStorage.getItem(LOCAL_STORAGE_THEME) || "light",
  },
  reducers: {
    themeToggle: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem(LOCAL_STORAGE_THEME, state.mode);
    },
  },
});

export const { themeToggle } = themeSlice.actions;

export default themeSlice.reducer;
