import { apiSlice } from "./apiSlice";

export const findAddressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // divisions
    getDivisions: builder.query({
      query: () => "/api/divisions",
    }),
    // districts
    getDistricts: builder.query({
      query: (divisionID) => `/api/divisions/${divisionID}/districts`,
    }),
    // upazilas
    getUpazilas: builder.query({
      query: (districtID) => `/api/districts/${districtID}/upazilas`,
    }),
    // unions
    getUnions: builder.query({
      query: (upazilaID) => `/api/upazilas/${upazilaID}/unions`,
    }),
  }),
});

export const {
  useGetDivisionsQuery,
  useLazyGetDistrictsQuery,
  useLazyGetUpazilasQuery,
  useLazyGetUnionsQuery,
} = findAddressApiSlice;
