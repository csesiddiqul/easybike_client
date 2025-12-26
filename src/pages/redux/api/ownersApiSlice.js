import { apiSlice } from "./apiSlice";
import { OWNERS } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // fetch user
    getOwner: builder.query({
      query: ({ searchText = "", page = 1, perPage = 10 }) => {
        let url = `${OWNERS}?per_page=${perPage}`;
        if (searchText) {
          url += `&searchText=${searchText}`;
        }
        if (page) {
          url += `&page=${page}`;
        }
        return url;
      },
      providesTags: ["Owner"],
      keepUnusedDataFor: 5,
    }),

    // create
    createOwner: builder.mutation({
      query: (formData) => ({
        url: `${OWNERS}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Owner"],
    }),
    // find
    findOwner: builder.query({
      query: (id) => `${OWNERS}/${id}`,
    }),
    // update
    updateOwner: builder.mutation({
      query: ({ formData, id }) => ({
        url: `${OWNERS}/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Owner"],
    }),
    // delete
    deleteOwner: builder.mutation({
      query: (id) => ({
        url: `${OWNERS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Owner"],
    }),
  }),
});

export const {
  useGetOwnerQuery,
  useGetRegularOwnersQuery,
  useLazyFindOwnerQuery,
  useCreateOwnerMutation,
  useUpdateOwnerMutation,
  useDeleteOwnerMutation,
} = userApiSlice;
