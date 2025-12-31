import { apiSlice } from "./apiSlice";
import { VEHICLE } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // fetch user
    getVehicle: builder.query({
      query: ({ searchText = "", page = 1, perPage = 10 }) => {
        let url = `${VEHICLE}?per_page=${perPage}`;
        if (searchText) {
          url += `&searchText=${searchText}`;
        }
        if (page) {
          url += `&page=${page}`;
        }
        return url;
      },
      providesTags: ["Vehicle"],
      keepUnusedDataFor: 5,
    }),

    // create
    createVehicle: builder.mutation({
      query: (formData) => ({
        url: `${VEHICLE}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Vehicle"],
    }),
    // find
    findVehicle: builder.query({
      query: (id) => `${VEHICLE}/${id}`,
    }),
    // update
    updateVehicle: builder.mutation({
      query: ({ formData, id }) => ({
        url: `${VEHICLE}/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Vehicle"],
    }),
    // delete
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `${VEHICLE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicle"],
    }),
  }),
});

export const {
  useGetVehicleQuery,
  useGetRegularVehiclesQuery,
  useLazyFindVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = userApiSlice;
