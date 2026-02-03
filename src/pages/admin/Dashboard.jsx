import React from "react";
import {
  FaIdCard,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCarSide,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUsers,
  FaTruck,
  
} from "react-icons/fa";


import {
  
  FaUserTie,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
  FaUserShield,
  FaCar,
  FaFileSignature,
  FaCarCrash,
  FaFileAlt,
  
} from "react-icons/fa";

import { FaUserDoctor } from "react-icons/fa6";
import { TbMedicineSyrup } from "react-icons/tb";

import { useAuthorized } from "../../hooks/useAuthorized";
import PieChart from "../../components/custom/charts/PieChart";
import BarChart from "../../components/custom/charts/BarChart";
import LineChart from "../../components/custom/charts/LineChart";
import DashboardCard from "../../components/custom/DashboardCard";
import Loader from "../../components/custom/Loader";

import { useGetDashboardQuery } from "../redux/api/frontendApiSlice";
import { useGetMyDriverProfileQuery } from "../redux/api/driverApiSlice";

const Dashboard = () => {
  /* ================= DASHBOARD DATA ================= */
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
  } = useGetDashboardQuery();

  const info = dashboardData?.data;

  /* ================= AUTH ================= */
  const { user } = useAuthorized();
  const roleName = user?.role?.name;

  /* ================= DRIVER PROFILE (ONLY FOR DRIVER) ================= */
  const {
    data: driverProfileData,
    isLoading: driverLoading,
    error: driverError,
  } = useGetMyDriverProfileQuery(undefined, {
    skip: roleName !== "Driver",
  });

  const driver = driverProfileData?.data;

  /* ================= LOADER ================= */
  if (dashboardLoading || (roleName === "Driver" && driverLoading)) {
    return <Loader />;
  }

  const isLicenceActive =
  driver?.latest_licence?.payment_status === "paid" &&
  new Date(driver?.latest_licence?.end_date) >= new Date();
  const licenceStatus = isLicenceActive ? "Active" : "Inactive";


  /* ================= ERROR (OPTIONAL) ================= */
  if (driverError && roleName === "Driver") {
    return <p className="text-red-600">Failed to load driver profile</p>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 border-t-4 border-green-600 rounded-t-lg">

      {/* ================= DRIVER DASHBOARD ================= */}
      {roleName === "Driver" && (
        <div className="col-span-12 card-layout">
          <h2 className="text-xl font-bold text-slate-600 mb-1">
            Driver Dashboard
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Licence & profile summary
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard
              icon={<FaCalendarAlt />}
              icon_color="text-red-600"
              title={driver?.latest_licence?.end_date}
              sub_title="Licence Expiry Date"
            />

            <DashboardCard
              icon={<FaIdCard />}
              icon_color="text-blue-600"
              title={driver?.registration_date}
              sub_title="Registration Date"
            />

            <DashboardCard
              icon={<FaCheckCircle />}
              icon_color={licenceStatus === "Active" ? "text-green-600" : "text-red-600"}
              title={licenceStatus}
              sub_title="Licence Status"
            />
            
            <DashboardCard
              icon={<FaClock />}
              icon_color="text-purple-600"
              title={driver?.years_of_experience ?? 0}
              sub_title="Years of Experience"
            />

          </div>
        </div>
      )}

      {/* ================= OWNER DASHBOARD ================= */}
      {roleName === "Owner" && (
        <div className="col-span-12 card-layout">
          <h2 className="text-xl font-bold text-slate-600 mb-1">
            Owner Dashboard
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Vehicle & payment overview
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard
              icon={<FaTruck />}
              icon_color="text-blue-600"
              title={info?.total_vehicles ?? 0}
              sub_title="Total Vehicles"
            />

            <DashboardCard
              icon={<FaExclamationTriangle />}
              icon_color="text-red-600"
              title={info?.expired_licence ?? 0}
              sub_title="Licence Expired"
            />

            <DashboardCard
              icon={<FaCarSide />}
              icon_color="text-green-600"
              title={info?.active_vehicles ?? 0}
              sub_title="Active Vehicles"
            />

            <DashboardCard
              icon={<FaMoneyBillWave />}
              icon_color="text-orange-600"
              title={info?.payment_pending ?? 0}
              sub_title="Payment Pending"
            />
          </div>
        </div>
      )}

      {/* ================= SUPER ADMIN DASHBOARD ================= */}
{roleName === "Super Admin" && (
  <>
    <div className="col-span-12 card-layout">
      <h2 className="text-xl font-bold text-slate-600 mb-1">
        Overview
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        System summary
      </p>

      <div className="grid grid-cols-4 gap-3">
        {/* 👨‍💼 Users */}
        <DashboardCard
          icon={<FaUsers />}
          icon_color="text-indigo-600"
          title={info?.total_users ?? 0}
          sub_title="System Users"
        />

        {/* 🚗 Drivers */}
        <DashboardCard
          icon={<FaUserTie />}
          icon_color="text-blue-600"
          title={info?.total_drivers ?? 0}
          sub_title="Total Drivers"
        />

        <DashboardCard
          icon={<FaUserCheck />}
          icon_color="text-green-600"
          title={info?.active_drivers ?? 0}
          sub_title="Active Drivers"
        />

        <DashboardCard
          icon={<FaUserClock />}
          icon_color="text-yellow-600"
          title={info?.pending_drivers ?? 0}
          sub_title="Pending Drivers"
        />

        <DashboardCard
          icon={<FaUserSlash />}
          icon_color="text-red-600"
          title={info?.expired_drivers ?? 0}
          sub_title="Expired Drivers"
        />

        {/* 👤 Owners */}
        <DashboardCard
          icon={<FaUserShield />}
          icon_color="text-teal-600"
          title={info?.total_owners ?? 0}
          sub_title="Total Owners"
        />

        <DashboardCard
          icon={<FaUserCheck />}
          icon_color="text-emerald-600"
          title={info?.active_owners ?? 0}
          sub_title="Active Owners"
        />

        {/* 🚙 Vehicles */}
        <DashboardCard
          icon={<FaCar />}
          icon_color="text-sky-600"
          title={info?.total_vehicles ?? 0}
          sub_title="Total Vehicles"
        />

        <DashboardCard
          icon={<FaCarSide />}
          icon_color="text-green-600"
          title={info?.active_vehicles ?? 0}
          sub_title="Active Vehicles"
        />

        <DashboardCard
          icon={<FaCarCrash />}
          icon_color="text-red-600"
          title={info?.expired_vehicles ?? 0}
          sub_title="Expired Vehicles"
        />

        {/* 📄 Licences */}
        <DashboardCard
          icon={<FaFileAlt />}
          icon_color="text-purple-600"
          title={info?.total_driver_licences ?? 0}
          sub_title="Driver Licences"
        />

        <DashboardCard
          icon={<FaFileSignature />}
          icon_color="text-fuchsia-600"
          title={info?.total_vehicle_licences ?? 0}
          sub_title="Vehicle Licences"
        />
      </div>
    </div>
  </>
)}

    </div>
  );
};

export default Dashboard;
