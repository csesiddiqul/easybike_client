import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";

const DriverPaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <CheckCircleOutlined
            style={{ fontSize: "72px", color: "#16a34a" }}
          />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>

        {/* SUB TITLE */}
        <h2 className="text-lg font-semibold text-green-600 mb-4">
          Driver Licence Activated
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you! Your payment has been completed successfully.
          <br />
          The driver licence is now active and ready to use.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/drivers")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          Go to Driver List
        </button>
      </div>
    </div>
  );
};

export default DriverPaymentSuccess;
