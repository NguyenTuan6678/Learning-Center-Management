import { Layout } from "antd";
import { theme } from "antd";

const { Content } = Layout;

const AppContent1 = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content style={{ margin: "24px 16px 0", overflowX: "hidden" }}>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          maxWidth: "1200px",
          margin: "0 auto",
          overflowX: "auto",
        }}
      >
        {children}
      </div>
    </Content>
  );
};

export default AppContent1;
