import { apiSlice } from "./apiSlice";
import { FISCAL_YEARS } from "../constants";

export const fiscalYearApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================
       LIST FISCAL YEARS
    ===================== */
    getFiscalYears: builder.query({
      query: () => `${FISCAL_YEARS}`,
      providesTags: ["FiscalYear"],
      keepUnusedDataFor: 5,
    }),

    /* =====================
       SINGLE FISCAL YEAR
    ===================== */
    findFiscalYear: builder.query({
      query: (id) => `${FISCAL_YEARS}/${id}`,
      keepUnusedDataFor: 3,
    }),

    /* =====================
       CREATE FISCAL YEAR
    ===================== */
    createFiscalYear: builder.mutation({
      query: (data) => ({
        url: `${FISCAL_YEARS}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FiscalYear"],
    }),

    /* =====================
       ACTIVATE FISCAL YEAR
    ===================== */
    activateFiscalYear: builder.mutation({
      query: (id) => ({
        url: `${FISCAL_YEARS}/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["FiscalYear"],
    }),

    /* =====================
       CORRECT FISCAL YEAR
    ===================== */
    correctFiscalYear: builder.mutation({
      query: ({ id, data }) => ({
        url: `${FISCAL_YEARS}/${id}/correct`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FiscalYear"],
    }),

  }),
});

export const {
  useGetFiscalYearsQuery,
  useLazyFindFiscalYearQuery,
  useCreateFiscalYearMutation,
  useActivateFiscalYearMutation,
  useCorrectFiscalYearMutation,
} = fiscalYearApiSlice;
