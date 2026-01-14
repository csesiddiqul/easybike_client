import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/admin/Dashboard";
import Auth from "./pages/admin/auth/Auth";
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";
import ProtectedAuthRoutes from "./utils/main/ProtectedAuthRoutes";
import LogRoutes from "./utils/main/LogRoutes";


import User from "./pages/admin/user/User";
import Roles from "./pages/admin/roles_permissions/Roles";
import Profile from "./pages/admin/Profile";
import ProtectedAuthorizedRoutes from "./utils/main/ProtectedAuthorizedRoutes";
import { Utils } from "./utils/utils";
import Unauthorized from "./pages/status/Unauthorized";
import NotFound from "./pages/status/NotFound";
import ProtectedUserStatusRoutes from "./utils/main/ProtectedUserStatusRoutes";
import AccountDisabled from "./pages/status/AccountDisabled";
import NotificationsPage from "./pages/admin/notifications/NotificationsPage";
import Owner from "./pages/admin/owner/Owner";
import Vehicle from "./pages/admin/vehicle/Vehicle";
import OwnerVehicles from "./pages/admin/ownerVehicle/OwnerVehicles";
import AppSettingPage from "./pages/admin/setting/Setting";
import DriverRenewReports from "./pages/admin/driver/DriverRenewReports";
import DriverPaymentReports from "./pages/admin/driver/DriverPaymentReports";


import Driverprofile from "./pages/driver/SelfProfile";
import MyLicence from "./pages/driver/SelfLicence";
import RenewHistory from "./pages/driver/RenewHistory";
import PaymentHistory from "./pages/driver/PaymentHistory";

import FiscalYear from "./pages/admin/fiscal_year/FiscalYears";
import Drivers from "./pages/admin/driver/Drivers";

import DriverPaymentSuccess from "./pages/status/DriverPaymentSuccess";
import DriverPaymentFailed from "./pages/status/DriverPaymentFailed";
import DriverPaymentCancel from "./pages/status/DriverPaymentCancel";
import VehicleLicense from "./pages/admin/vehicleLicense/VehicleLicense";
import VehicleLicenseOwner from "./pages/admin/vehicleLicense/VehicleLicenseOwner";
import VehiclePaymentSuccess from "./pages/status/VehiclePaymentSuccess";
import VehiclePaymentHistory from "./pages/driver/VehiclePaymentHistory";
import VehicleLicenseGeneration from "./pages/admin/vehicleLicense/VehicleLicenseGeneration";


const App = () => {
  const mode = useSelector((state) => state.theme.mode);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <Routes>
        <Route element={<LogRoutes />}>
          <Route path="/" element={<Auth />} />
        </Route>
        <Route element={<ProtectedAuthRoutes />}>
          <Route element={<ProtectedUserStatusRoutes />}>
            <Route element={<RootLayout />}>
              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_dashboard]}
                  />
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
              </Route>




              {/* ================= Driver Panel Menu ===============*/}
              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_self_profile]}
                  />
                }
              >
                <Route path="my-profile" element={<Driverprofile />} />
              </Route>


              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_self_licence]}
                  />
                }
              >
                <Route path="my-licence" element={<MyLicence />} />
              </Route>

              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_self_payment_history]}
                  />
                }
              >
                <Route path="my-payments" element={<PaymentHistory />} />
              </Route>



              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_self_payment_history]}
                  />
                }
              >
                <Route path="vehicle-payments" element={<VehiclePaymentHistory />} />
              </Route>


              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_self_renew_history]}
                  />
                }
              >
                <Route path="my-renew-history" element={<RenewHistory />} />
              </Route>








              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_fiscal_year]}
                  />
                }
              >
                <Route path="fiscal-year" element={<FiscalYear />} />
              </Route>

              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_driver]}
                  />
                }
              >
                <Route path="drivers" element={<Drivers />} />
              </Route>





              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_user]}
                  />
                }
              >
                <Route path="users" element={<User />} />
              </Route>

              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_owner]}
                  />
                }
              >
                <Route path="owners" element={<Owner />} />
              </Route>

              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_vehicle]}
                  />
                }
              >
                <Route path="vehicles" element={<Vehicle />} />
              </Route>

              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_owner_vehicle]}
                  />
                }
              >
                <Route path="owner-vehicles" element={<OwnerVehicles />} />
              </Route>


              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_vehicle_license]}
                  />
                }
              >
                <Route path="vehicle-licenses" element={<VehicleLicense />} />
              </Route>



              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_vehicle_license]}
                  />
                }
              >
                <Route path="licenses-generation" element={<VehicleLicenseGeneration />} />
              </Route>


              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_owner_vehicle]}
                  />
                }
              >
                <Route path="owner-vehicle-licenses" element={<VehicleLicenseOwner />} />
              </Route>




              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_role]}
                  />
                }
              >
                <Route path="roles" element={<Roles />} />
              </Route>


              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_renew_reports]}
                  />
                }
              >
                <Route path="driver-renew-reports" element={<DriverRenewReports />} />
              </Route>

              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.driver_payment_reports]}
                  />
                }
              >
                <Route path="driver-payment-reports" element={<DriverPaymentReports />} />
              </Route>


              <Route
                element={
                  <ProtectedAuthorizedRoutes
                    requiredPermissions={[Utils.permissions.view_role]}
                  />
                }
              >
                <Route path="settings" element={<AppSettingPage />} />
              </Route>






              <Route path="notifications" element={<NotificationsPage />} />

              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="/payment-success" element={<DriverPaymentSuccess />} />
          <Route path="/vehicle-licenses-payment-success" element={<VehiclePaymentSuccess />} />
          <Route path="/payment-failed" element={<DriverPaymentFailed />} />
          <Route path="/payment-cancel" element={<DriverPaymentCancel />} />

          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="account-disabled" element={<AccountDisabled />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;