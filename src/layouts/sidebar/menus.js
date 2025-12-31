
import { FiLock } from "react-icons/fi";
import { FiUser, FiCreditCard, FiRefreshCw, FiFileText } from "react-icons/fi";
import { HiOutlineDatabase } from "react-icons/hi";
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
            name: "owners",
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
    name: "vehicles",
    link: "vehicles",
    icon: MdElectricRickshaw,
    requiredPermissions: [Utils.permissions.view_vehicle],
  },


  {
    name: "Owner Vehicles",
    link: "owner-vehicles",
    icon: MdElectricRickshaw,
    requiredPermissions: [Utils.permissions.view_vehicle],
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
