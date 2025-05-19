import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter1 = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      ©{new Date().getFullYear()} Created by Harry Nguyen
    </Footer>
  );
};

export default AppFooter1;
