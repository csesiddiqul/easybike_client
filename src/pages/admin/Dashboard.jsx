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
              App summary
            </p>

            <div className="grid grid-cols-4 gap-3">
              <DashboardCard
                icon={<FaUsers />}
                icon_color="text-green-600"
                title={info?.total_admin_users ?? 0}
                sub_title="System Users"
              />

              <DashboardCard
                icon={<FaUserDoctor />}
                icon_color="text-blue-600"
                title={info?.total_patients ?? 0}
                sub_title="Patients"
              />

              <DashboardCard
                icon={<TbMedicineSyrup />}
                icon_color="text-lime-600"
                title={info?.total_medicines ?? 0}
                sub_title="Total Medicine"
              />

              <DashboardCard
                icon={<TbMedicineSyrup />}
                icon_color="text-orange-600"
                title={info?.total_stock_quantity ?? 0}
                sub_title="Stock"
              />

              <DashboardCard
                icon={<TbMedicineSyrup />}
                icon_color="text-teal-600"
                title={info?.total_remaining_quantity ?? 0}
                sub_title="Remaining"
              />

              <DashboardCard
                icon={<TbMedicineSyrup />}
                icon_color="text-pink-600"
                title={info?.expired_quantity ?? 0}
                sub_title="Expired"
              />

              <DashboardCard
                icon={<TbMedicineSyrup />}
                icon_color="text-fuchsia-600"
                title={info?.damaged_quantity ?? 0}
                sub_title="Damaged"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 card-layout">
            <h2 className="text-md font-bold text-slate-600 mb-3">
              Monthly Medicine Report
            </h2>
            <BarChart data={info?.monthly_report ?? []} />
          </div>

          <div className="col-span-12 md:col-span-4 card-layout">
            <h2 className="text-md font-bold text-slate-600 mb-3">
              Medicine Overview
            </h2>
            <PieChart data={info} />
          </div>

          <div className="col-span-12 card-layout">
            <h2 className="text-md font-bold text-slate-600 mb-3">
              Trend Analysis
            </h2>
            <LineChart data={info?.monthly_report ?? []} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
