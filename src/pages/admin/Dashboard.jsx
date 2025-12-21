import React from "react";
import { FaUser, FaUserDoctor } from "react-icons/fa6";
import PieChart from "../../components/custom/charts/PieChart";
import BarChart from "../../components/custom/charts/BarChart";
import LineChart from "../../components/custom/charts/LineChart";
import RecentActivities from "../../components/RecentActivities";
import { useGetDashboardQuery } from "../redux/api/frontendApiSlice";
import Loader from "../../components/custom/Loader";
import { TbMedicineSyrup } from "react-icons/tb";
import DashboardCard from "../../components/custom/DashboardCard";

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardQuery();

  const info = data?.data;

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="grid grid-cols-12 gap-4 border-t-4 border-green-600 rounded-t-lg">
      <div className="col-span-12 md:col-span-12 card-layout">
        <div className="grid grid-cols-4 gap-3">
          {/* Overview */}
          <div className="col-span-4">
            <div className="mb-3">
              <h2 className="text-xl text-slate-600 font-bold dark:text-slate-300">
                Overview
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                App summary
              </p>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<FaUser />}
              icon_color="text-green-600"
              title={info?.total_admin_users}
              sub_title="System Users"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<FaUserDoctor />}
              icon_color="text-blue-600"
              title={info?.total_patients}
              sub_title="Patients"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<TbMedicineSyrup />}
              icon_color="text-lime-600"
              title={info?.total_medicines}
              sub_title="Total Medicine"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<TbMedicineSyrup />}
              icon_color="text-orange-600"
              title={info?.total_stock_quantity}
              sub_title="Medicine Stock"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<TbMedicineSyrup />}
              icon_color="text-fuchsia-600"
              title={info?.total_distributed_quantity}
              sub_title="Medicine Distributed"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<TbMedicineSyrup />}
              icon_color="text-teal-600"
              title={info?.total_remaining_quantity}
              sub_title="Medicine Remaining"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<TbMedicineSyrup />}
              icon_color="text-cyan-600"
              title={info?.expired_quantity}
              sub_title="Medicine Expiration"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <DashboardCard
              icon={<TbMedicineSyrup />}
              icon_color="text-pink-600"
              title={info?.damaged_quantity}
              sub_title="Medicine Damaged"
            />
          </div>
        </div>
      </div>
      {/* <div className="col-span-12 md:col-span-4 card-layout">
        <h2 className="text-md text-slate-600 dark:text-slate-300 font-bold mb-3">
          Medicine Overview
        </h2>
        <div className="mt-7">
          <PieChart data={info} />
        </div>
      </div> */}
      <div className="col-span-12 md:col-span-8 card-layout">
        <h2 className="text-md text-slate-600 font-bold mb-3 dark:text-slate-300">
          Medicine Overview
        </h2>
        <div>
          <BarChart data={info?.monthly_report} />
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 card-layout">
        {/* <div>
          <RecentActivities />
        </div> */}
        <h2 className="text-md text-slate-600 dark:text-slate-300 font-bold mb-3">
          Medicine Overview
        </h2>
        <div className="mt-7">
          <PieChart data={info} />
        </div>
      </div>
      <div className="col-span-12 md:col-span-12 card-layout">
        <h2 className="text-md text-slate-600 dark:text-slate-300 font-bold mb-3">
          Medicine Overview
        </h2>
        <div>
          <LineChart data={info?.monthly_report} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
