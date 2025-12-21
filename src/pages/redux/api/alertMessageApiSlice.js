import { apiSlice } from "./apiSlice";
import { GET_ALERT_MESSAGES } from "../constants";

export const alertMessageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // fetch AlertMessage
    getAlertMessage: builder.query({
      query: ({ page = 1, perPage = 10, searchText = "" }) => {
        let url = `${GET_ALERT_MESSAGES}?per_page=${perPage}`;
        if (page) {
          url += `&page=${page}`;
        }
        if (searchText) {
          url += `&searchText=${searchText}`;
        }
        return url;
      },
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetAlertMessageQuery } = alertMessageApiSlice;
