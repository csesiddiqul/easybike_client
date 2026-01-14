import { apiSlice } from "./apiSlice";
import { MAKE_VEHICLE_LICENSE_PAYMENT, OWNERVEHICLE } from "../constants";

export const vehicleLicenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getMakeVehicleLicensePayment: builder.query({
      query: ({ owner_id, phone, status }) => {
        let params = new URLSearchParams();

        if (owner_id) {
          params.append("owner_id", owner_id);
        }

        if (phone) {
          params.append("phone", phone);
        }

        if (status) {
          params.append("status", status);
        }

        const queryString = params.toString();
        return queryString
          ? `${MAKE_VEHICLE_LICENSE_PAYMENT}?${queryString}`
          : MAKE_VEHICLE_LICENSE_PAYMENT;
      },

      providesTags: ["MakeVehicleLicensePayment"],
      keepUnusedDataFor: 5,
    }),


    createVehiclePayment: builder.mutation({
      query: (formData) => ({
        url: "/api/vehicle-payments",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VehicleLicense"],
    }),

    createVehicleLicenseGeneration: builder.mutation({
      query: (formData) => ({
        url: "/api/vehicle-licenses",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VehicleLicense"],
    }),

    // fetch user
    getVehicleLicense: builder.query({
      query: ({ searchText = "", owner_user_id = "", page = 1, perPage = 10 }) => {
        let url = `${OWNERVEHICLE}?per_page=${perPage}`;
        if (searchText) {
          url += `&searchText=${searchText}`;
        }
        if (owner_user_id) {
          url += `&owner_user_id=${owner_user_id}`;
        }
        if (page) {
          url += `&page=${page}`;
        }
        return url;
      },
      providesTags: ["VehicleLicense"],
      keepUnusedDataFor: 5,
    }),

    // create
    createVehicleLicense: builder.mutation({
      query: (formData) => ({
        url: `${OWNERVEHICLE}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VehicleLicense"],
    }),
    // find
    findVehicleLicense: builder.query({
      query: (id) => `${OWNERVEHICLE}/${id}`,
    }),
    // update
    updateVehicleLicense: builder.mutation({
      query: ({ formData, id }) => ({
        url: `${OWNERVEHICLE}/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VehicleLicense"],
    }),
    // delete
    deleteVehicleLicense: builder.mutation({
      query: (id) => ({
        url: `${OWNERVEHICLE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleLicense"],
    }),
  }),
});

export const {
  useGetMakeVehicleLicensePaymentQuery,
  useCreateVehiclePaymentMutation,
  useCreateVehicleLicenseGenerationMutation,
  useLazyGetMakeVehicleLicensePaymentQuery,
  useGetVehicleLicenseQuery,
  useGetRegularVehicleLicensesQuery,
  useLazyFindVehicleLicenseQuery,
  useCreateVehicleLicenseMutation,
  useUpdateVehicleLicenseMutation,
  useDeleteVehicleLicenseMutation,
} = vehicleLicenseApiSlice;
