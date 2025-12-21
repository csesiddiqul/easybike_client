import { Avatar, Dropdown, Segmented, Skeleton, Switch } from "antd";
import { useEffect } from "react";
import { FaSortDown } from "react-icons/fa6";
import { MdMenu, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { themeToggle } from "../pages/redux/features/themeSlice";
import { useAuthorized } from "../hooks/useAuthorized";
import Loader from "../components/custom/Loader";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../pages/redux/api/authApiSlice";
import { logout } from "../pages/redux/features/authSlice";
import { apiSlice } from "../pages/redux/api/apiSlice";
import toast from "react-hot-toast";
import Notifications from "./Notifications";

const TopBar = ({ setOpen }) => {
  const { user, isLoading } = useAuthorized();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (mode) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(mode);
    }
  }, [mode]);

  const toggleDarkMode = () => {
    dispatch(themeToggle());
  };

  const items = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "0",
      icon: <FiUser />,
    },
    // {
    //   label: <Link to="/settings">Settings</Link>,
    //   key: "1",
    //   icon: <FiSettings />,
    // },
    {
      type: "divider",
    },
    {
      label: <span>Logout</span>,
      key: "3",
      icon: <FiLogOut />,
      danger: true,
    },
  ];

  // logout event
  const navigate = useNavigate();
  const [logoutApiCall, { isSuccess, data }] = useLogoutMutation();

  const handleMenuItem = async (e) => {
    if (e.key === "3") {
      // handle logout
      await logoutApiCall().unwrap();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate("/");
      toast.success(data?.message);
    }
  }, [isSuccess]);

  return (
    <div className="p-2 bg-white dark:bg-gray-900 w-full custom-shadow fixed z-10">
      <div className="flex justify-between items-center px-4">
        <div className="m-3 md:hidden  " onClick={() => setOpen(true)}>
          <MdMenu className="dark:text-slate-300" size={25} />
        </div>
        <div className="hidden md:block text-slate-300">search...</div>
        <div className="px-2">
          <div className="flex items-center gap-5">
            <Segmented
              options={[
                {
                  label: <MdOutlineLightMode size={24} className="p-1" />,
                  value: "light",
                },
                {
                  label: <MdOutlineDarkMode size={24} className="p-1" />,
                  value: "dark",
                },
              ]}
              value={mode}
              onChange={toggleDarkMode}
            />
            <Notifications />
            {/* user dropdown */}
            <Dropdown
              menu={{ items, selectable: true, onClick: handleMenuItem }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <div className="flex items-center cursor-pointer gap-2 ">
                <Avatar size={35} />
                {!isLoading ? (
                  <div className="hidden md:block">
                    <div className="text-sm text-gray-700 dark:text-slate-50">
                      {user?.name}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-slate-200">
                      {user?.role?.name}
                    </span>
                  </div>
                ) : (
                  <Skeleton.Button active size={"small"} />
                )}
                <FaSortDown className="dark:text-slate-300 hidden md:block" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
