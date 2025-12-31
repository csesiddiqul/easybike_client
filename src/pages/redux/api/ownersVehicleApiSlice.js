import { apiSlice } from "./apiSlice";
import { OWNERVEHICLE } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // fetch user
    getOwnerVehicle: builder.query({
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
      providesTags: ["OwnerVehicle"],
      keepUnusedDataFor: 5,
    }),

    // create
    createOwnerVehicle: builder.mutation({
      query: (formData) => ({
        url: `${OWNERVEHICLE}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["OwnerVehicle"],
    }),
    // find
    findOwnerVehicle: builder.query({
      query: (id) => `${OWNERVEHICLE}/${id}`,
    }),
    // update
    updateOwnerVehicle: builder.mutation({
      query: ({ formData, id }) => ({
        url: `${OWNERVEHICLE}/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["OwnerVehicle"],
    }),
    // delete
    deleteOwnerVehicle: builder.mutation({
      query: (id) => ({
        url: `${OWNERVEHICLE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OwnerVehicle"],
    }),
  }),
});

export const {
  useGetOwnerVehicleQuery,
  useGetRegularOwnerVehiclesQuery,
  useLazyFindOwnerVehicleQuery,
  useCreateOwnerVehicleMutation,
  useUpdateOwnerVehicleMutation,
  useDeleteOwnerVehicleMutation,
} = userApiSlice;
