import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable";
import { DatePicker, Segmented, Tag } from "antd";
import { useGetDriverPaymentReportsQuery } from "../../redux/api/driverApiSlice";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DriverPaymentReports = () => {
  /* ================= STATE ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [paymentType, setPaymentType] = useState("all"); // 🔥 default all
  const [fiscalYearId, setFiscalYearId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /* ================= QUERY PARAMS (IMPORTANT FIX) ================= */
  const queryParams = {
    page: currentPage,
    perPage,

    ...(searchValue && { search: searchValue }),

    ...(paymentType !== "all" && {
      payment_type: paymentType,
    }),

    ...(fiscalYearId && { fiscal_year_id: fiscalYearId }),

    ...(startDate &&
      endDate && {
        from_date: startDate,
        to_date: endDate,
      }),
  };

  /* ================= API ================= */
  const { data, isLoading } =
    useGetDriverPaymentReportsQuery(queryParams);

  const rows = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {};

  const totalData = meta?.total ?? 0;
  const lastPage = meta?.last_page ?? 1;

  /* ================= SEARCH ================= */
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchValue(value);
    }, 400),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  /* ================= DATE FILTER ================= */
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0].format("YYYY-MM-DD"));
      setEndDate(dates[1].format("YYYY-MM-DD"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    setCurrentPage(1);
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { label: "SI", name: "si" },
    { label: "Driver Name", name: "driver" },
    { label: "Fiscal Year", name: "fiscal_year" },
    { label: "Amount", name: "amount" },
    { label: "Payment Method", name: "method" },
    { label: "Transaction ID", name: "trx_id" },
    { label: "Status", name: "status" },
    { label: "Paid Date", name: "paid_at" },
  ];

  /* ================= TABLE DATA ================= */
  const TableData = rows.map((item, i) => ({
    si: (currentPage - 1) * perPage + i + 1,

    driver: item.user?.name ?? "-",

    
    fiscal_year: item.licence?.fiscal_year?.name ?? "-",


    amount: `৳ ${item.amount}`,

    method: item.payment_method ?? "-",

    trx_id: item.trx_id ?? "-",

    status:
      item.status === "paid" ? (
        <Tag color="green" className="font-semibold">
          PAID
        </Tag>
      ) : (
        <Tag color="red" className="font-semibold">
          UNPAID
        </Tag>
      ),

    paid_at: item.paid_at
      ? dayjs(item.paid_at).format("DD MMM, YYYY")
      : "-",
  }));

  return (
    <div className="card-layout">
      {/* ================= HEADER ================= */}
      <div className="grid grid-cols-2 headerbg gap-3 py-2 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-600">
            Driver Payment Report
          </h1>
        </div>

        <div className="flex justify-end">
          <RangePicker
            format="DD-MM-YYYY"
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Segmented
          value={paymentType}
          onChange={(v) => {
            setPaymentType(v);
            setCurrentPage(1);
          }}
          options={[
            { label: "All Payment", value: "all" },
            { label: "Paid", value: "paid" },
            { label: "Unpaid", value: "unpaid" },
          ]}
        />
      </div>

      {/* ================= TABLE ================= */}
      <ReusableTable
        columns={columns}
        data={TableData}
        isLoading={isLoading}
        currentPage={currentPage}
        lastPage={lastPage}
        totalData={totalData}
        onSearchChange={handleSearchChange}
        searchText={searchText}
        onPageChange={setCurrentPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        print
        exportExcel
      />
    </div>
  );
};

export default DriverPaymentReports;
