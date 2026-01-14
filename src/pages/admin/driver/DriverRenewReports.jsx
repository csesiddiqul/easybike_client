import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable";
import { DatePicker, Segmented, Tag } from "antd";
import { useGetDriverRenewReportsQuery } from "../../redux/api/driverApiSlice";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DriverRenewReports = () => {
  /* ================= STATE ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // 🔑 default null → show all
  const [status, setStatus] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [fiscalYearId, setFiscalYearId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /* ================= API ================= */
  const { data, isLoading } = useGetDriverRenewReportsQuery({
    page: currentPage,
    perPage,
    search: searchValue,
    ...(status && { status }),
    ...(paymentType && { payment_type: paymentType }),
    ...(fiscalYearId && { fiscal_year_id: fiscalYearId }),
    ...(startDate && endDate && {
      from_date: startDate,
      to_date: endDate,
    }),
  });

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

  /* ================= DATE ================= */
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

  /* ================= TABLE ================= */
  const columns = [
    { label: "SI", name: "si" },
    { label: "Driver Name", name: "driver" },
    { label: "Fiscal Year", name: "fiscal_year" },
    { label: "Start Date", name: "start_date" },
    { label: "End Date", name: "end_date" },
    { label: "Payment", name: "payment_status" },
    { label: "Status", name: "status" },
    { label: "Renew Date", name: "renew_date" },
  ];

  const TableData = rows.map((item, i) => {
    const driverStatus = item.driver?.computed_status ?? "inactive";

    return {
      si: (currentPage - 1) * perPage + i + 1,

      driver: item.driver?.user?.name ?? "-",

      fiscal_year: item.fiscal_year?.name ?? "-",

      start_date: item.start_date
        ? dayjs(item.start_date).format("DD MMM, YYYY")
        : "-",

      end_date: item.end_date
        ? dayjs(item.end_date).format("DD MMM, YYYY")
        : "-",

      payment_status:
        item.payment_status === "paid" ? (
          <Tag color="green">PAID</Tag>
        ) : (
          <Tag color="red">UNPAID</Tag>
        ),

      status: (
        <Tag
          color={
            driverStatus === "active"
              ? "green"
              : driverStatus === "expired"
              ? "red"
              : driverStatus === "pending"
              ? "orange"
              : "default"
          }
        >
          {driverStatus.toUpperCase()}
        </Tag>
      ),

      renew_date: item.created_at
        ? dayjs(item.created_at).format("DD MMM, YYYY")
        : "-",
    };
  });


  /* ================= UI ================= */
  return (
    <div className="card-layout">
      {/* HEADER */}
      <div className="grid grid-cols-2 headerbg gap-3 py-2 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-600">
            Driver Licence Renew Report
          </h1>
        </div>

        <div className="flex justify-end gap-2">
          <RangePicker format="DD-MM-YYYY" onChange={handleDateChange} />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Segmented
          value={status}
          onChange={(v) => {
            setStatus(v);
            setCurrentPage(1);
          }}
          options={[
            { label: "All", value: null },
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
            { label: "Pending", value: "pending" },
            { label: "Inactive", value: "inactive" },
          ]}
        />

        <Segmented
          value={paymentType}
          onChange={(v) => {
            setPaymentType(v);
            setCurrentPage(1);
          }}
          options={[
            { label: "All Payment", value: null },
            { label: "Paid", value: "paid" },
            { label: "Unpaid", value: "unpaid" },
          ]}
        />
      </div>

      {/* TABLE */}
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

export default DriverRenewReports;
