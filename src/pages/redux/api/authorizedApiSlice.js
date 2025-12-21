import { PERMISSIONS, ROLE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const authorizedApiSlice = apiSlice.injectEndpoints({
  // get roles
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ROLE_URL,
      providesTags: ["Roles"],
      keepUnusedDataFor: 5,
    }),
    getPermissions: builder.query({
      query: () => PERMISSIONS,
      keepUnusedDataFor: 5,
    }),
    // create a new role
    createRole: builder.mutation({
      query: (role) => ({
        url: ROLE_URL,
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["Roles"],
    }),
    // delete a role
    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: `${ROLE_URL}/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
    // update a role
    updateRole: builder.mutation({
      query: (role) => ({
        url: `${ROLE_URL}/${role.id}`,
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} = authorizedApiSlice;
