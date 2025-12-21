import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from Redux state
    const token = getState().auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "User",
    "PoliceUnits",
    "Categories",
    "MedicineUnits",
    "Medicine",
    "Patient",
    "MedicineStocks",
    "Distributions",
    "Roles",
  ],
  endpoints: () => ({}),
});
