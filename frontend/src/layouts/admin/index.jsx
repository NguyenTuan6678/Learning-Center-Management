import React, { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import AppHeader from "./navigation/topbar";
import AppFooter from "./navigation/footer";
import AppContent from "./navigation/content";
import BreadCrumb from "../../components/breadcrumbs";
import ManageStudents from "./page/student.list";
import AppSider from "./navigation/sidebar";
import { ColorModeContext, useMode } from "../../themes/theme";
import ManageAccounts from "./page/account.list";
import ManageParents from "./page/parent.list";
import ManageBills from "./page/bill.list";
import ManageAdminLearningOutcomes from "./page/student.learningoutcome";
import ManageTeachers from "./page/teacher.list";
import ManageCourses from "./page/course.list";
import ManageClasses from "./page/class.list";
import AdminDashboardOverview from "./page/admin.dashboard";

const componentMap = {
  dashboard: (onNavigate) => <AdminDashboardOverview onNavigate={onNavigate} />,
  manageStudents: () => <ManageStudents />,
  manageAccounts: () => <ManageAccounts />,
  manageParents: () => <ManageParents />,
  manageBills: () => <ManageBills />,
  manageLearningOutcomes: () => <ManageAdminLearningOutcomes />,
  manageTeachers: () => <ManageTeachers />,
  manageCourses: () => <ManageCourses />,
  manageClasses: () => <ManageClasses />,
};

const AdminDashboard = () => {
  const [theme, colorMode] = useMode();
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleMenuItemClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  const renderContent = () => {
    const componentFn = componentMap[selectedMenuItem];
    if (selectedMenuItem === "dashboard" && componentFn) {
      return componentFn(setSelectedMenuItem);
    }
    return componentFn ? (
      componentFn()
    ) : (
      <Box sx={{ p: 3, minHeight: 360 }}>{selectedMenuItem} Content</Box>
    );
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <AppSider
            onMenuItemClick={handleMenuItemClick}
            selectedKeys={[selectedMenuItem]}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.mode === "dark" ? "background.default" : "#f8fafc",
              minHeight: "100vh",
              overflowX: "hidden",
            }}
          >
            <AppHeader />

            <Box
              sx={{
                flexGrow: 1,
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <BreadCrumb selectedMenuItem={selectedMenuItem} />

              <AppContent>{renderContent()}</AppContent>
            </Box>

            <AppFooter />
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminDashboard;
