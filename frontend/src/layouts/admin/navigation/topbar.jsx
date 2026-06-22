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
      key: "theme",
      icon: theme.palette.mode === "dark" ? <LightModeOutlinedIcon style={{ fontSize: 16 }} /> : <DarkModeOutlinedIcon style={{ fontSize: 16 }} />,
      label: theme.palette.mode === "dark" ? "Cài đặt: Giao diện sáng" : "Cài đặt: Giao diện tối",
      onClick: colorMode.toggleColorMode,
    },
    {
      type: "divider",
    },
    {
      key: "signout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleSignOut,
    },
  ];

  return (
    <Box
      display="flex"
      py={1.5}
      px={3}
      justifyContent="flex-end"
      alignItems="center"
      gap={1.5}
      sx={{
        borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#f1f5f9"}`,
        bgcolor: theme.palette.mode === "dark" ? "rgba(20, 27, 45, 0.5)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: "70px",
      }}
    />
  );
};

export default AppHeader;
