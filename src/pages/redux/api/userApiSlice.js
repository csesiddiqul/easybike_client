import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // fetch user
    getUser: builder.query({
      query: ({ searchText = "", page = 1, perPage = 10 }) => {
        let url = `${USER_URL}?per_page=${perPage}`;
        if (searchText) {
          url += `&searchText=${searchText}`;
        }
        if (page) {
          url += `&page=${page}`;
        }
        return url;
      },
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    // create
    createUser: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    // find
    findUser: builder.query({
      query: (id) => `${USER_URL}/${id}`,
    }),
    // update
    updateUser: builder.mutation({
      query: ({ formData, id }) => ({
        url: `${USER_URL}/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    // delete
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetRegularUsersQuery,
  useLazyFindUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
