import { apiSlice } from "./apiSlice";
import { DASHBOARD } from "../constants";

export const frontendApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => DASHBOARD,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetDashboardQuery,
} = frontendApiSlice;
