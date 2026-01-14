
import { FiLock } from "react-icons/fi";
import { FiUser, FiCreditCard, FiRefreshCw, FiFileText } from "react-icons/fi";
import { HiOutlineDatabase } from "react-icons/hi";
import { GiSteeringWheel } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa";

import { Utils } from "../../utils/utils";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdElectricRickshaw } from "react-icons/md";

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
      Utils.permissions.view_owner,
    ],
    dropdownMenus: [
      {
        name: "authorized",
        icon: FiLock,
        links: ["/roles", "/users", '/owners'],
        requiredPermissions: [
          Utils.permissions.view_role,
          Utils.permissions.view_user,
          Utils.permissions.view_owner,
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
          {
            name: "Owners",
            link: "/owners",
            requiredPermissions: [Utils.permissions.view_owner],
          },
        ],
      },
    ],
  },

 {
    name: "Fiscal Year",
    link: "fiscal-year",
    icon: FaRegCalendarCheck,
    requiredPermissions: [Utils.permissions.view_fiscal_year],
  },

  {
    name: "Driver",
    link: "drivers",
    icon: GiSteeringWheel,
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
    name: "My License",
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
    name: "Vehicles",
    link: "vehicles",
    icon: MdElectricRickshaw,
    requiredPermissions: [Utils.permissions.view_vehicle],
  },


  {
    label: "Reports",
    requiredPermissions: [
      Utils.permissions.driver_renew_reports,
      Utils.permissions.driver_payment_reports,
    ],
    dropdownMenus: [
      {
        name: "Driver Reports",
        icon: FiLock,
        links: ["/driver-renew-reports", "/driver-payment-reports"],
        requiredPermissions: [
          Utils.permissions.driver_renew_reports,
          Utils.permissions.driver_payment_reports,
        ],
        subMenus: [
          {
            name: "Renew Reports",
            link: "/driver-renew-reports",
            requiredPermissions: [Utils.permissions.driver_renew_reports],
          },
          {
            name: "Payment Reports",
            link: "/driver-payment-reports",
            requiredPermissions: [Utils.permissions.driver_payment_reports],
          },
        ],
      },
    ],
  },










  {
    name: "Owner Vehicles",
    link: "owner-vehicles",
    icon: MdElectricRickshaw,
    requiredPermissions: [Utils.permissions.view_owner_vehicle],
  },

  // {
  //   name: "Notifications",
  //   link: "notifications",
  //   icon: IoMdNotificationsOutline,
  // },
  {
    name: "Settings",
    link: "settings",
    icon: IoSettingsOutline,
    requiredPermissions: [Utils.permissions.view_website_setting],
  },

  
];
