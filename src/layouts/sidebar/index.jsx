import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import SubMenu from "./SubMenu";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../../assets";
import { useAuthorized } from "../../hooks/useAuthorized";
import { menus } from "./menus";
import SideBarLoader from "./SideBarLoader";


import { useGetSystemSettingsQuery } from "../../pages/redux/api/systemSettingApiSlice";

const Sidebar = ({ open, setOpen, isTabletMid }) => {
  const { hasPermission, somePermission, isLoading } = useAuthorized();
  const sidebarRef = useRef();
  const { pathname } = useLocation();

  /* ================= SYSTEM SETTINGS ================= */
  const { data: settingRes } = useGetSystemSettingsQuery();
  const setting = settingRes?.data;

  const systemName = setting?.system_name || "Fireball";
  const systemLogo = setting?.system_logo || assets.logo;

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  /* ================= ANIMATION ================= */
  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: { damping: 40 },
        },
        closed: {
          x: -250,
          width: 0,
          transition: { damping: 40, delay: 0.15 },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: { damping: 40 },
        },
        closed: {
          width: "4rem",
          transition: { damping: 40 },
        },
      };

  const activeBg =
    "bg-blue-200 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
  const hoverBg = "hover:bg-blue-200 dark:hover:bg-gray-800";
  const linkBase =
    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150";

  return (
    <div className="fixed z-20">
      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        }`}
      />

      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-white dark:bg-gray-900 shadow-xl z-[999]
        max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-screen"
      >
        {/* ================= LOGO AREA ================= */}
        <Link to="/">
          <div className="flex items-center gap-3 py-3 border-b border-slate-300 dark:border-slate-700 mx-3">
            <img
              src={systemLogo}
              alt="System Logo"
              className="w-10 h-10 object-contain"
            />
            {open && (
              <span className="text-xl font-semibold whitespace-pre dark:text-slate-300 truncate">
                {systemName}
              </span>
            )}
          </div>
        </Link>

        {/* ================= MENU ================= */}
        {isLoading ? (
          <SideBarLoader />
        ) : (
          <div className="flex flex-col h-full">
            <ul className="custom-scroll px-2.5 py-5 flex flex-col gap-1 text-[0.9rem] font-medium overflow-x-hidden h-full">
              {menus?.map((item, i) => (
                <React.Fragment key={item?.name ?? item?.label ?? i}>
                  {/* single link */}
                  {item?.name &&
                    item?.link &&
                    hasPermission(item.requiredPermissions) && (
                      <li>
                        <NavLink
                          to={item.link}
                          end
                          className={({ isActive }) =>
                            `${linkBase} ${
                              isActive ? activeBg : hoverBg
                            }`
                          }
                        >
                          {item.icon &&
                            React.createElement(item.icon, {
                              size: 22,
                              className: "min-w-max",
                            })}
                          {open && (
                            <span className="truncate">{item.name}</span>
                          )}
                        </NavLink>
                        <hr className="h-[1px] bg-gray-300 dark:bg-gray-700 border-0 my-1" />
                      </li>
                    )}

                  {/* dropdowns */}
                  {(open || isTabletMid) &&
                    item?.dropdownMenus &&
                    somePermission(item.requiredPermissions) && (
                      <div className="mt-2">
                        {item?.label && (
                          <small className="pl-3 text-slate-500 dark:text-slate-300 block mb-2">
                            {item.label}
                          </small>
                        )}
                        {item.dropdownMenus.map((menu) => (
                          <SubMenu
                            key={menu.name}
                            hasPermission={hasPermission}
                            somePermission={somePermission}
                            data={menu}
                          />
                        ))}
                      </div>
                    )}
                </React.Fragment>
              ))}
            </ul>

            {/* ================= FOOTER ================= */}
            {open && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-3">
                <div className="text-sm dark:text-slate-300">
                  {systemName}
                </div>
                <small className="text-xs text-slate-500">
                  Powered by City Corporation
                </small>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;
