// src/redux/api/systemSettingApiSlice.js
import { apiSlice } from "./apiSlice";

export const systemSettingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSystemSettings: builder.query({
      query: () => ({
        url: "/api/system-settings",
        method: "GET",
      }),
      providesTags: ["SystemSettings"],
    }),

    updateSystemSettings: builder.mutation({
      query: (formData) => ({
        url: "/api/system-settings",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SystemSettings"],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} = systemSettingApiSlice;
