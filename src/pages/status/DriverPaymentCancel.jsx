import React from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const DriverPaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <ExclamationCircleOutlined
            style={{ fontSize: "72px", color: "#f59e0b" }}
          />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Cancelled ⚠️
        </h1>

        {/* SUB TITLE */}
        <h2 className="text-lg font-semibold text-yellow-600 mb-4">
          Transaction Cancelled by User
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          You have cancelled the payment process.
         
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            Resume Payment
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverPaymentCancel;
