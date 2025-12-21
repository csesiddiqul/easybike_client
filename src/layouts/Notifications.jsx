import { Badge, Dropdown, Menu, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useGetAlertMessageQuery } from "../pages/redux/api/alertMessageApiSlice";
import { textSubStings } from "../utils/main/textShort";
import { enLocalDateTimeFormat } from "../utils/main/dateFormat";

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [notifications, setNotifications] = useState([]);

  // Fetch alert messages
  const { data, isLoading } = useGetAlertMessageQuery({
    page: currentPage,
    perPage,
  });

  // Append new data to the notifications list
  useEffect(() => {
    if (data?.data?.data) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...data.data.data,
      ]);
    }
  }, [data]);

  const handleMenuItem = (e) => {
    console.log(`Notification clicked: ${e.key}`);
  };

  const items = notifications.map((item, i) => ({
    label: (
      <div className="border-t">
        <p>{textSubStings(item.data, 10)}</p>
        <p>{enLocalDateTimeFormat(item.created_at)}</p>
      </div>
    ),
    key: i + 1,
  }));

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const menu = (
    <Menu
      onClick={handleMenuItem}
      items={items.map((item) => ({
        label: item.label,
        key: item.key,
      }))}
    />
  );

  return (
    <div>
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        arrow
        trigger={["click"]}
        overlayClassName="notification-dropdown"
      >
        <Badge count={notifications.length} className="cursor-pointer">
          <IoMdNotificationsOutline size={22} />
        </Badge>
      </Dropdown>

      <style jsx>{`
        .notification-dropdown .ant-dropdown-menu {
          max-height: 200px;
          overflow-y: auto;
        }

        /* Custom scrollbar styles */
        .notification-dropdown .ant-dropdown-menu::-webkit-scrollbar {
          width: 3px;
        }
        .notification-dropdown .ant-dropdown-menu::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
        }
        .notification-dropdown
          .ant-dropdown-menu::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
        .notification-dropdown .ant-dropdown-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .notification-dropdown .ant-dropdown-menu {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
