import { useState } from "react";
import dayjs from "dayjs";
import { Tag, Button } from "antd";

import Loader from "../../components/custom/Loader";
import ReusableTable from "../../components/custom/ReusableTable";

import { useGetMyVehiclePaymentHistoryQuery } from "../redux/api/driverApiSlice";

const VehiclePaymentHistory = () => {
  const { data, isLoading } = useGetMyVehiclePaymentHistoryQuery();
  const [expandedRows, setExpandedRows] = useState({});

  if (isLoading) return <Loader />;

  const payments = data?.data ?? [];

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns = [
    { label: "SI", name: "si" },
    { label: "Payment Date", name: "payment_date" },
    { label: "Total Amount", name: "total_amount" },
    { label: "TrxID", name: "trx_id" },
    { label: "Status", name: "status" },
    { label: "Action", name: "action" },
  ];

  const tableData = payments.map((payment, index) => ({
    si: index + 1,
    payment_date: payment.paid_at
      ? dayjs(payment.paid_at).format("DD MMM, YYYY")
      : dayjs(payment.created_at).format("DD MMM, YYYY"),
    total_amount: `৳ ${payment.total_amount}`,
    trx_id: payment.transaction_id,
    status:
      payment.payment_status === "success" ? (
        <Tag color="green" className="px-3 py-1 font-semibold">
          PAID
        </Tag>
      ) : (
        <Tag color="red" className="px-3 py-1 font-semibold">
          UNPAID
        </Tag>
      ),
    action: (
      <Button
        type="link"
        onClick={() => toggleRow(payment.id)}
      >
        {expandedRows[payment.id] ? "Hide Details" : "Show Details"}
      </Button>
    ),
    // hidden content for expanded row
    expandedContent: (
      <div className="pl-5 mt-2 border-l border-gray-300">
        {/* Owner Info */}
        <div className="mb-2">
          <h3 className="font-semibold">Owner Info</h3>
          <p>Name: {payment.owner?.father_or_husband_name}</p>
          <p>Ward: {payment.owner?.ward_number}</p>
          <p>Mohalla: {payment.owner?.mohalla_name}</p>
          <p>NID: {payment.owner?.nid_number}</p>
          <p>Present Address: {payment.owner?.present_address}</p>
        </div>

        {/* Items */}
        <div>
          <h3 className="font-semibold">Licence Items</h3>
          <table className="w-full text-left border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Fiscal Year</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Activated At</th>
                <th className="p-2 border">Expired At</th>
              </tr>
            </thead>
            <tbody>
              {payment.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">
                    {item.licence?.fiscal_year?.name ?? "N/A"}
                  </td>
                  <td className="p-2 border">৳ {item.amount}</td>
                  <td className="p-2 border">
                    {dayjs(item.licence?.activated_at).format("DD MMM, YYYY")}
                  </td>
                  <td className="p-2 border">
                    {dayjs(item.licence?.expired_at).format("DD MMM, YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
        expandable={(record) =>
          expandedRows[record.si] ? record.expandedContent : null
        }
      />
    </div>
  );
};

export default VehiclePaymentHistory;
