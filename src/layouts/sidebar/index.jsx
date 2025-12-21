import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import SubMenu from "./SubMenu";

// * React icons
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../../assets";
import { useAuthorized } from "../../hooks/useAuthorized";
import { menus } from "./menus";
import SideBarLoader from "./SideBarLoader";

const Sidebar = ({ open, setOpen, isTabletMid }) => {
  const { hasPermission, somePermission, isLoading } = useAuthorized();
  const sidebarRef = useRef();
  const { pathname } = useLocation();

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

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  // active + hover classes (change colors if you want)
  const activeBg =
    "bg-blue-200 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
  const hoverBg = "hover:bg-blue-200 dark:hover:bg-gray-800";
  const linkBase =
    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150";

  return (
    <div className="fixed z-20">
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className=" bg-white dark:bg-gray-900 text-gray shadow-xl z-[999] max-w-[16rem]  w-[16rem] 
            overflow-hidden md:relative fixed
         h-screen "
      >
        <Link to={"/"}>
          <div className="flex items-center cursor-pointer gap-2.5 font-medium  py-3 border-b-2 border-slate-300 dark:border-slate-700  mx-3">
            <img src={assets.logo} width={45} alt="" />
            <span className="text-xl whitespace-pre dark:text-slate-300">
              Fireball
            </span>
          </div>
        </Link>

        {isLoading ? (
          <SideBarLoader />
        ) : (
          <div className="flex flex-col h-full">
            <ul className="custom-scroll whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 h-[100%]">
              {menus?.map((item, i) => (
                <React.Fragment key={item?.name ?? item?.label ?? i}>
                  {/* single top-level link */}
                  {item?.name && item?.link && hasPermission(item.requiredPermissions) && (
                    <li>
                      <NavLink
                        to={item?.link}
                        end
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? activeBg : hoverBg}`
                        }
                      >
                        {item.icon &&
                          React.createElement(item.icon, {
                            size: 23,
                            className: "min-w-max",
                          })}
                        <span className="truncate">{item.name}</span>
                      </NavLink>
                       <hr className="h-[1.5px] bg-gray-300 dark:bg-gray-700 border-0 my-1" />
                    </li>

                    
                  )}
                  

                  {/* groups with dropdowns (only when sidebar is open or on tablet) */}
                  {(open || isTabletMid) &&
                    item?.dropdownMenus &&
                    somePermission(item.requiredPermissions) && (
                      <div key={i} className=" dark:border-slate-700 mt-2">
                        {item?.label && (
                          <small className="pl-3 text-slate-500 dark:text-slate-300 inline-block mb-2">
                            {item?.label}
                          </small>
                        )}
                        {item?.dropdownMenus?.map((menu) => (
                          <div key={menu.name} className="flex flex-col gap-1">
                            <SubMenu
                              hasPermission={hasPermission}
                              somePermission={somePermission}
                              data={menu}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </React.Fragment>
              ))}
            </ul>

            {/* optional footer area (only when open) */}
            {open && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-3">
                <div className="text-sm dark:text-slate-300">Spark</div>
                <small className="text-xs text-slate-500 dark:text-slate-400">No-cost $0/month</small>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Sidebar;
