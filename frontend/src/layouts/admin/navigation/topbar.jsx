import { useContext } from "react";
import { Avatar, Dropdown, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../../services/auth.service";
import { setLocalData } from "../../../services/localStorage";
import { isLoggedInText } from "../../../utils/constants";
import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../themes/theme";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const AppHeader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const handleSignOut = async () => {
    try {
      const response = await logout();

      if (response.status === 200) {
        setLocalData(isLoggedInText, false);
        window.location.reload();
        message.success("Đăng xuất thành công!");
      } else {
        const errorData = response.data || { message: "Lỗi không xác định" };
        message.error(`Đăng xuất thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
      message.error("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  const menuItems = [
    {
      key: "signout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleSignOut,
    },
  ];

  return (
    <Box display="flex" p={2} justifyContent="flex-end">
      <IconButton onClick={colorMode.toggleColorMode}>
        {colors === "dark" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </Box>
  );
};

export default AppHeader;
