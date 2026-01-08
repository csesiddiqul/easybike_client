import dayjs from "dayjs";
import Loader from "../../components/custom/Loader";
import ReusableTable from "../../components/custom/ReusableTable";
import { Tag } from "antd";

import {
  useGetMyPaymentHistoryQuery,
} from "../redux/api/driverApiSlice";

const PaymentHistory = () => {
  const { data, isLoading } = useGetMyPaymentHistoryQuery();

  if (isLoading) return <Loader />;

  const payments = data?.data ?? [];

  const columns = [
    { label: "SI", name: "si" },
    { label: "Fiscal Year", name: "fiscal_year" },
    { label: "Payment Date", name: "payment_date" },
    { label: "Amount", name: "amount" },
    { label: "TrxID", name: "trx_id" },
    { label: "Status", name: "status" },
  ];

  const tableData = payments.map((item, index) => ({
    si: index + 1,

    fiscal_year: item.licence.fiscal_year?.name ?? "N/A",

    payment_date: item.paid_at
      ? dayjs(item.paid_at).format("DD MMM, YYYY")
      : dayjs(item.created_at).format("DD MMM, YYYY"),

    amount: `৳ ${item.amount}`,
    trx_id : item.trx_id || "N/A",
    status:
      item.status === "paid" ? (
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
          Payment History
        </h1>
      </div>

      {/* 🔥 hide per-page select ONLY here */}
      <style>
        {`
          .card-layout .ant-select {
            display: none !important;
          }
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

export default PaymentHistory;
