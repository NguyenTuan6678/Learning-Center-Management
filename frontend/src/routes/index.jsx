import {
  Navigate,
  Outlet,
  Route,
  Routes,
  createHashRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect } from "react";
import Error404 from "../screens/errorpage/Error";
import {
  admin,
  isLoggedInText,
  parent,
  roles,
  student,
  teacher,
} from "../utils/constants";
import { getLocalData } from "../services/localStorage";
import Dashboard from "../layouts/admin";
import SignInSide from "../screens/login/login.screen";
import HomePage from "../screens/home/home.screen";
import { useSelector } from "react-redux";
import AdminDashboard from "../layouts/admin";
import StudentDashboard from "../layouts/student";
import TeacherDashboard from "../layouts/teacher";

function isLoggedIn() {
  return getLocalData(isLoggedInText);
}

function RoleBasedRoute({ allowedRoles, children }) {
  const role = useSelector((state) => state.auth.role);
  const location = useLocation();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

function GuestGuard({ children }) {
  console.log(children);
  if (isLoggedIn()) {
    return <Navigate to={"/"} />;
  }
  return <>{children}</>;
}

function ProtectedRoute({ children }) {
  // console.log("**log protected");
  // console.log(isLoggedIn());
  const isLoggedIn = getLocalData(isLoggedInText);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
}

function MainRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      if (isLoggedIn()) {
        console.log("location.path.name: ", location.pathname);
        console.log("***isLoggedIn: ", isLoggedIn());
        const role = getLocalData(roles);
        console.log("***role: ", role);
        switch (role) {
          case admin:
            navigate("/admin", { replace: true });
            break;
          case student:
            navigate("/student", { replace: true });
            break;
          case teacher:
            navigate("/teacher", { replace: true });
            break;
          case parent:
            navigate("/parent", { replace: true });
            break;
          default:
            navigate("/home", { replace: true });
        }
      } else {
        navigate("/home", { replace: true });
      }
    } else if (
      !isLoggedIn &&
      location.pathname !== "/login" &&
      location.pathname !== "/home"
    ) {
      navigate("/home", { replace: true });
    }
  }, [navigate, isLoggedIn, location.pathname]);

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<Error404 />} />
      <Route
        path="/login"
        element={
          <GuestGuard>
            <SignInSide />
          </GuestGuard>
        }
      />
      <Route
        path="/unauthorized"
        element={<div>Bạn không có quyền truy cập trang này.</div>}
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={[admin]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <RoleBasedRoute allowedRoles={[admin]}>
              <Dashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <RoleBasedRoute allowedRoles={[student]}>
              <StudentDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <RoleBasedRoute allowedRoles={[teacher]}>
              <TeacherDashboard />
            </RoleBasedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export const router = createHashRouter([
  {
    path: "*",
    Component: MainRoutes,
    errorElement: <Error404 />,
  },
]);
