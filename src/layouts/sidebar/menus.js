
import { FiLock } from "react-icons/fi";
import { HiOutlineDatabase } from "react-icons/hi";
import { Utils } from "../../utils/utils";
import { IoMdNotificationsOutline } from "react-icons/io";

export const menus = [
  {
    name: "Dashboard",
    link: "dashboard",
    icon: HiOutlineDatabase,
    requiredPermissions: [Utils.permissions.view_dashboard],
  },

  {
    label: "System Control",
    requiredPermissions: [
      Utils.permissions.view_role,
      Utils.permissions.view_user,
    ],
    dropdownMenus: [
      {
        name: "authorized",
        icon: FiLock,
        links: ["/roles", "/users"],
        requiredPermissions: [
          Utils.permissions.view_role,
          Utils.permissions.view_user,
        ],
        subMenus: [
          {
            name: "roles",
            link: "/roles",
            requiredPermissions: [Utils.permissions.view_role],
          },
          {
            name: "users",
            link: "/users",
            requiredPermissions: [Utils.permissions.view_user],
          },
        ],
      },
    ],
  },
  {
    name: "Notifications",
    link: "notifications",
    icon: IoMdNotificationsOutline,
  },
  // {
  //   name: "Settings",
  //   link: "settings",
  //   icon: SlSettings,
  // },
];
