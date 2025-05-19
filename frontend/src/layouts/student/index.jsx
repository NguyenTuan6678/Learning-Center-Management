import { useState } from "react";
import { Layout } from "antd";
import AppHeader1 from "./navigation/topbar";
import AppFooter1 from "./navigation/footer";
import AppContent1 from "./navigation/content";
import BreadCrumb from "../../components/breadcrumbs";
import AppSider1 from "./navigation/sidebar";
import { ColorModeContext, useMode } from "../../themes/theme";
import "./index.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import StudentBills from "./page/student.bill";
import PaidAndCancelledBills from "./page/student.bill.history";
import StudentEnrollment from "./page/reg.class";

const componentMap = {
  dashboard: () => (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360 }}
    >
      Dashboard Content
    </div>
  ),
  manageBills: () => <StudentBills />,
  manageBillsHistory: () => <PaidAndCancelledBills />,
  enrollmentClass: () => <StudentEnrollment />,
};

const StudentDashboard = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleMenuItemClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  const renderContent = () => {
    const ComponentToRender = componentMap[selectedMenuItem];
    return ComponentToRender ? (
      <ComponentToRender />
    ) : (
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        {selectedMenuItem} Content
      </div>
    );
  };

  // return (
  //   <Layout style={{ minHeight: "100vh", flexDirection: "column" }}>
  //     <AppHeader />
  //     <Layout style={{ flexDirection: "row", flex: 1 }}>
  //       <AppSider
  //         onMenuItemClick={handleMenuItemClick}
  //         selectedKeys={[selectedMenuItem]}
  //       />
  //       <Layout style={{ flexDirection: "column", flex: 1, marginLeft: 0 }}>
  //         <BreadCrumb selectedMenuItem={selectedMenuItem} />
  //         <AppContent>{renderContent()}</AppContent>
  //         <AppFooter style={{ textAlign: "right", padding: "0 16px 24px" }} />
  //       </Layout>
  //     </Layout>
  //   </Layout>
  // );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AppSider1
            onMenuItemClick={handleMenuItemClick}
            selectedKeys={[selectedMenuItem]}
            isSidebar={isSidebar}
          />
          <main className="content">
            <AppHeader1 setIsSidebar={setIsSidebar} />
            <Layout
              style={{
                minHeight: "91vh",
                flexDirection: "column",
                flex: 1,
                marginLeft: 0,
              }}
            >
              <BreadCrumb selectedMenuItem={selectedMenuItem} />
              <AppContent1>{renderContent()}</AppContent1>
              <AppFooter1
                style={{ textAlign: "right", padding: "0 16px 24px" }}
              />
            </Layout>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default StudentDashboard;
