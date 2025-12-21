import React from "react";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      title: "Logged in",
      description: "User logged into the system",
      timestamp: "2024-08-01 10:00 AM",
    },
    {
      id: 2,
      title: "Updated Profile",
      description: "User updated their profile information",
      timestamp: "2024-08-01 11:30 AM",
    },
    {
      id: 3,
      title: "Made a Purchase",
      description: "User purchased a new item",
      timestamp: "2024-08-01 12:45 PM",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-md font-semibold mb-4 dark:text-slate-300">
        Recent Activities
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-slate-100 border border-slate-300 dark:border-gray-700  dark:bg-gray-900  rounded-lg p-4 "
          >
            <h3 className="text-md font-medium dark:text-slate-300">
              {activity.title}
            </h3>
            <p className="text-gray-600 dark:text-slate-300">
              {activity.description}
            </p>
            <span className="text-gray-500 dark:text-slate-400 text-sm">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
