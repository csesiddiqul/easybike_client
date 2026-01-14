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


    getMyDriverProfile: builder.query({
      query: () => "/api/drivers/me",
    }),

    getMyLicenceHistory: builder.query({
      query: () => "/api/drivers/me/licence-history",
    }),

    getMyPaymentHistory: builder.query({
      query: () => ({
        url: "/api/payments/my-history",
        method: "GET",
      }),
    }),

    getDriverPaymentReports: builder.query({
      query: (params) => ({
        url: "/api/driver-payment-reports",
        method: "GET",
        params, // 🔥 from_date, to_date, payment_type, fiscal_year_id
      }),
      keepUnusedDataFor: 5,
    }),

    /* =================================================
       🔥 ADMIN CENTRAL RENEW / LICENCE REPORT
       Route: driver-renew-reports
    ================================================= */
    getDriverRenewReports: builder.query({
      query: (params) => ({
        url: "/api/driver-renew-reports",
        method: "GET",
        params, // 🔥 status, payment_type, fiscal_year_id, date range
      }),
      keepUnusedDataFor: 5,
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
  useGetMyDriverProfileQuery,
  useGetMyLicenceHistoryQuery,
  useGetMyPaymentHistoryQuery,
  useGetDriverPaymentReportsQuery,
  useGetDriverRenewReportsQuery,

} = driverApiSlice;
