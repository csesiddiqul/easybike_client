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
                    requiredPermissions={[Utils.permissions.view_owner]}
                  />
                }
              >
                <Route path="vehicles" element={<Owner />} />
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
              <Route path="notifications" element={<NotificationsPage />} />

              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="account-disabled" element={<AccountDisabled />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
