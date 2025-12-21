import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";

const SubMenu = ({ data, hasPermission, somePermission }) => {
  const { pathname } = useLocation();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const activeBg =
    "bg-blue-300 text-blue-600 dark:bg-blue-900 dark:text-blue-300";

  if (!somePermission(data.requiredPermissions)) return null;

  return (
    <>
      {/* TOP MENU */}
      <li
        className={`link cursor-pointer rounded-md transition-all duration-200
          ${
            data?.links.includes(pathname)
              ? activeBg
              : "hover:bg-blue-200 dark:hover:bg-gray-800"
          }
        `}
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <data.icon size={23} className="min-w-max dark:text-slate-300" />
        <p className="flex-1 capitalize dark:text-slate-300">{data.name}</p>

        <IoIosArrowDown
          className={`${
            subMenuOpen && "rotate-180"
          } duration-200 dark:text-slate-300`}
        />
      </li>

      {/* Top Divider */}
      <hr className="h-[1.5px] bg-gray-300 dark:bg-gray-700 border-0 my-1" />

      {/* SUB MENUS */}
      <motion.ul
        animate={subMenuOpen ? { height: "fit-content" } : { height: 0 }}
        className="flex h-0 flex-col pl-10 text-[0.85rem] font-normal overflow-hidden"
      >
        {data.subMenus?.map((menu) => {
          if (!hasPermission(menu.requiredPermissions)) return null;

          return (
            <li key={menu.name} className="w-full">
              <NavLink
                to={menu.link}
                className={({ isActive }) =>
                  `block py-2 px-2 rounded-md transition-all duration-200 capitalize
                    ${
                      isActive
                        ? activeBg
                        : "hover:bg-blue-100 dark:hover:bg-gray-800"
                    }
                  `
                }
              >
                {menu.name}
              </NavLink>

              {/* Submenu Divider */}
              <hr className="h-[1.5px] bg-gray-200 dark:bg-gray-700 border-0 my-1"/>
            </li>
          );
        })}
      </motion.ul>
    </>
  );
};

export default SubMenu;
