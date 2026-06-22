import { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import AppHeader1 from "./navigation/topbar";
import AppFooter1 from "./navigation/footer";
import AppContent1 from "./navigation/content";
import BreadCrumb from "../../components/breadcrumbs";
import AppSider1 from "./navigation/sidebar";
import { ColorModeContext, useMode } from "../../themes/theme";
import StudentBills from "./page/student.bill";
import PaidAndCancelledBills from "./page/student.bill.history";
import StudentEnrollment from "./page/reg.class";
import StudentDashboardOverview from "./page/student.dashboard";

const componentMap = {
  dashboard: (onNavigate) => <StudentDashboardOverview onNavigate={onNavigate} />,
  manageBills: () => <StudentBills />,
  manageBillsHistory: () => <PaidAndCancelledBills />,
  enrollmentClass: () => <StudentEnrollment />,
};

const StudentDashboard = () => {
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
          <AppSider1
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
            }}
          >
            <AppHeader1 />
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
              <AppContent1>{renderContent()}</AppContent1>
            </Box>
            <AppFooter1 />
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default StudentDashboard;
