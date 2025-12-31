
import { FiLock } from "react-icons/fi";
import { FiUser, FiCreditCard, FiRefreshCw, FiFileText } from "react-icons/fi";
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
    name: "Fiscal Year",
    link: "fiscal-year",
    icon: IoMdNotificationsOutline,
    requiredPermissions: [Utils.permissions.view_fiscal_year],
  },

  {
    name: "Driver",
    link: "drivers",
    icon: IoMdNotificationsOutline,
    requiredPermissions: [Utils.permissions.view_driver],
  },


  

  
  /* =====================
     DRIVER SELF PANEL (NO SUB MENU)
  ===================== */
  {
    name: "My Profile",
    link: "my-profile",
    icon: FiUser,
    requiredPermissions: [
      Utils.permissions.driver_self_profile,
    ],
  },

  {
    name: "My Licence",
    link: "my-licence",
    icon: FiFileText,
    requiredPermissions: [
      Utils.permissions.driver_self_licence,
    ],
  },

  {
    name: "Payment History",
    link: "my-payments",
    icon: FiCreditCard,
    requiredPermissions: [
      Utils.permissions.driver_self_payment_history,
    ],
  },

  {
    name: "Renew History",
    link: "my-renew-history",
    icon: FiRefreshCw,
    requiredPermissions: [
      Utils.permissions.driver_self_renew_history,
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
