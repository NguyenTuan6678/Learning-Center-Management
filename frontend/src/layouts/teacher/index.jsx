import { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import AppHeader from "./navigation/topbar";
import AppFooter from "./navigation/footer";
import AppContent from "./navigation/content";
import BreadCrumb from "../../components/breadcrumbs";
import AppSider from "./navigation/sidebar";
import { ColorModeContext, useMode } from "../../themes/theme";
import TeacherClasses from "./page/class.list";
import TeacherDashboardOverview from "./page/teacher.dashboard";

const componentMap = {
  dashboard: (onNavigate) => <TeacherDashboardOverview onNavigate={onNavigate} />,
  teacherClasses: () => <TeacherClasses />,
};

const TeacherDashboard = () => {
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

export default TeacherDashboard;
