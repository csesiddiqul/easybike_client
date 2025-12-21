import { apiSlice } from "./apiSlice";
import {
  CHANGE_PASSWORD,
  EMAIL_VERIFICATION,
  FORGOT_PASSWORD,
  RESEND_EMAIL,
  RESET_PASSWORD,
  USER_AUTHORIZED,
  USER_LOGIN,
  USER_LOGOUT,
  USER_PROFILE,
  USER_REGISTER,
} from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: USER_LOGIN,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USER_REGISTER,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: USER_LOGOUT,
        method: "POST",
      }),
    }),
    getAuthUser: builder.query({
      query: () => USER_PROFILE,
    }),
    getAuthorizeUser: builder.query({
      query: () => USER_AUTHORIZED,
    }),
    emailVerify: builder.query({
      query: (token) => ({
        url: `${EMAIL_VERIFICATION}?token=${token}`,
        method: "GET",
      }),
    }),

    emailReSend: builder.mutation({
      query: () => ({
        url: `${RESEND_EMAIL}`,
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${FORGOT_PASSWORD}`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${RESET_PASSWORD}?token=${data.token}`,
        method: "POST",
        body: data,
      }),
    }),

    // change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: CHANGE_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetAuthUserQuery,
  useGetAuthorizeUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useEmailVerifyQuery,
  // useEmailReSendQuery,
  useEmailReSendMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  // change password
  useChangePasswordMutation,
} = authApiSlice;
