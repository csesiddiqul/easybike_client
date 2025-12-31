import { apiSlice } from "./apiSlice";
import { DRIVERS } from "../constants";

export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================
       LIST DRIVERS
    ===================== */
    getDrivers: builder.query({
      query: () => `${DRIVERS}`,
      providesTags: ["Driver"],
      keepUnusedDataFor: 5,
    }),

    /* =====================
       SINGLE DRIVER
    ===================== */
    findDriver: builder.query({
      query: (id) => `${DRIVERS}/${id}`,
      keepUnusedDataFor: 3,
    }),

    /* =====================
       CREATE DRIVER
       (multipart/form-data)
    ===================== */
    createDriver: builder.mutation({
      query: (formData) => ({
        url: `${DRIVERS}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Driver"],
    }),

    /* =====================
       UPDATE DRIVER
       (multipart/form-data)
    ===================== */
    updateDriver: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${DRIVERS}/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Driver"],
    }),

    /* =====================
       DEACTIVATE DRIVER
    ===================== */
    deactivateDriver: builder.mutation({
      query: (id) => ({
        url: `${DRIVERS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Driver"],
    }),

    /* =====================
      DRIVER LICENCE PAYMENT
    ===================== */
    initDriverLicencePayment: builder.mutation({
      query: (driverId) => ({
        url: `${DRIVERS}/${driverId}/licence/payment`,
        method: "POST",
      }),
    }),


  }),
});

export const {
  useGetDriversQuery,
  useLazyFindDriverQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeactivateDriverMutation,
  useInitDriverLicencePaymentMutation,
} = driverApiSlice;
