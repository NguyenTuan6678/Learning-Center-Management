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

const componentMap = {
  dashboard: () => <Box sx={{ p: 3, minHeight: 360 }}>Dashboard Content</Box>,
  manageStudents: () => <ManageStudents />,
  manageAccounts: () => <ManageAccounts />,
  manageParents: () => <ManageParents />,
  manageBills: () => <ManageBills />,
  manageLearningOutcomes: () => <ManageAdminLearningOutcomes />,
};

const AdminDashboard = () => {
  const [theme, colorMode] = useMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleMenuItemClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  const renderContent = () => {
    const ComponentToRender = componentMap[selectedMenuItem];
    return ComponentToRender ? (
      <ComponentToRender />
    ) : (
      <Box sx={{ p: 3, minHeight: 360 }}>{selectedMenuItem} Content</Box>
    );
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <AppSider
            isOpen={isSidebarOpen}
            onMenuItemClick={handleMenuItemClick}
            selectedKeys={[selectedMenuItem]}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              marginLeft: { sm: isSidebarOpen ? "0" : "80px" },
              width: { sm: `calc(100% - ${isSidebarOpen ? 0 : 40}px)` },
            }}
          >
            <AppHeader
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              <BreadCrumb selectedMenuItem={selectedMenuItem} />

              <AppContent>{renderContent()}</AppContent>

              <AppFooter />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminDashboard;
