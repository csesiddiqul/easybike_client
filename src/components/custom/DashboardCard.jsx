import React from "react";

const DashboardCard = ({ icon, icon_color, title, sub_title }) => {
  return (
    <div className="p-4 bg-slate-100 border border-slate-300 dark:border-gray-700  dark:bg-gray-900 rounded-md">
      <p className={`${icon_color} text-3xl font-bold mb-2`}>{icon}</p>
      <h2 className="text-xl font-bold text-slate-600 dark:text-slate-100">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-slate-300 text-sm">{sub_title}</p>
    </div>
  );
};

export default DashboardCard;
