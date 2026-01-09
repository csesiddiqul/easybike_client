import dayjs from "dayjs";
import Loader from "../../components/custom/Loader";
import ReusableTable from "../../components/custom/ReusableTable";
import { Tag } from "antd";

import {
  useGetMyLicenceHistoryQuery,
} from "../redux/api/driverApiSlice";

const RenewHistory = () => {
  const { data, isLoading } = useGetMyLicenceHistoryQuery();

  if (isLoading) return <Loader />;

  const licences = data?.data ?? [];

  const columns = [
    { label: "SI", name: "si" },
    { label: "Fiscal Year", name: "fiscal_year" },
    { label: "Renew Date", name: "renew_date" },
    { label: "Start Date", name: "start_date" },
    { label: "End Date", name: "end_date" },
    { label: " Status", name: "payment_status" },
  ];

  const tableData = licences.map((item, index) => ({
    si: index + 1,

    fiscal_year: item.fiscal_year?.name ?? "N/A",

    renew_date: item.created_at
      ? dayjs(item.created_at).format("DD MMM, YYYY")
      : "-",

    start_date: item.start_date
      ? dayjs(item.start_date).format("DD MMM, YYYY")
      : "-",

    end_date: item.end_date
      ? dayjs(item.end_date).format("DD MMM, YYYY")
      : "-",

    payment_status:
    item.payment_status === "paid" ? (
      <Tag color="green" className="px-3 py-1 font-semibold">
        PAID
      </Tag>
    ) : (
      <Tag color="red" className="px-3 py-1 font-semibold">
        UNPAID
      </Tag>
    ),
  }));

  return (
    <div className="card-layout">
      <div className="flex justify-between headerbg items-center py-2 mb-0">
        <h1 className="text-xl font-bold text-gray-600">
          Licence Renew History
        </h1>
      </div>

      {/* 🔥 hide per-page select (ONLY this page) */}
      <style>
        {`
          /* hide per page select */
          .card-layout .ant-select {
            display: none !important;
          }

          /* hide top control row if any */
          .card-layout .table-top,
          .card-layout .table-actions {
            display: none !important;
          }
        `}
      </style>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RenewHistory;
