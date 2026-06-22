import { useState, useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  HomeOutlined,
  PeopleOutlined,
  PersonOutlined,
  MenuOutlined,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon,
  SettingsOutlined as SettingsIcon,
  ExitToAppOutlined as LogoutIcon,
} from "@mui/icons-material";
import { tokens, ColorModeContext } from "../../../themes/theme";
import logo from "../../../assets/imgs/small45.png";
import { logout } from "../../../services/auth.service";
import { setLocalData } from "../../../services/localStorage";
import { isLoggedInText } from "../../../utils/constants";

const AppSider = ({ onMenuItemClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Tổng quan");
  const [openSubmenus, setOpenSubmenus] = useState({
    accounts: false,
    students: false,
    teachers: false,
    parents: false,
    bills: false,
  });

  const handleSubmenuToggle = (submenu) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenu]: !prev[submenu],
    }));
  };

  const handleSignOut = async () => {
    try {
      const response = await logout();
      if (response.status === 200) {
        setLocalData(isLoggedInText, false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    }
  };

  const menuItems = [
    {
      title: "Tổng quan",
      icon: <HomeOutlined />,
      key: "dashboard",
      onClick: () => {
        setSelected("Tổng quan");
        onMenuItemClick({ key: "dashboard" });
      },
    },
    {
      title: "Tài khoản",
      icon: <PersonOutlined />,
      submenu: [
        {
          title: "Quản lý tài khoản",
          icon: <PeopleOutlined />,
          key: "manageAccounts",
          onClick: () => {
            setSelected("Quản lý tài khoản");
            onMenuItemClick({ key: "manageAccounts" });
          },
        },
      ],
    },
    {
      title: "Môn học & Lớp học",
      icon: <PersonOutlined />,
      submenu: [
        {
          title: "Quản lý môn học",
          icon: <PeopleOutlined />,
          key: "manageCourses",
          onClick: () => {
            setSelected("Quản lý môn học");
            onMenuItemClick({ key: "manageCourses" });
          },
        },
        {
          title: "Quản lý lớp học",
          icon: <PeopleOutlined />,
          key: "manageClasses",
          onClick: () => {
            setSelected("Quản lý lớp học");
            onMenuItemClick({ key: "manageClasses" });
          },
        },
      ],
    },
    {
      title: "Học sinh",
      icon: <PeopleOutlined />,
      submenu: [
        {
          title: "Quản lý học sinh",
          icon: <PeopleOutlined />,
          key: "manageStudents",
          onClick: () => {
            setSelected("Quản lý học sinh");
            onMenuItemClick({ key: "manageStudents" });
          },
        },
        {
          title: "Quản lý kết quả học tập",
          icon: <PeopleOutlined />,
          key: "manageLearningOutcomes",
          onClick: () => {
            setSelected("Quản lý kết quả học tập");
            onMenuItemClick({ key: "manageLearningOutcomes" });
          },
        },
      ],
    },
    {
      title: "Giáo viên",
      icon: <PeopleOutlined />,
      submenu: [
        {
          title: "Quản lý giáo viên",
          icon: <PeopleOutlined />,
          key: "manageTeachers",
          onClick: () => {
            setSelected("Quản lý giáo viên");
            onMenuItemClick({ key: "manageTeachers" });
          },
        },
      ],
    },
    {
      title: "Phụ huynh",
      icon: <PeopleOutlined />,
      submenu: [
        {
          title: "Quản lý phụ huynh",
          icon: <PeopleOutlined />,
          key: "manageParents",
          onClick: () => {
            setSelected("Quản lý phụ huynh");
            onMenuItemClick({ key: "manageParents" });
          },
        },
      ],
    },
    {
      title: "Hoá đơn",
      icon: <PeopleOutlined />,
      submenu: [
        {
          title: "Quản lý hoá đơn",
          icon: <PeopleOutlined />,
          key: "manageBills",
          onClick: () => {
            setSelected("Quản lý hoá đơn");
            onMenuItemClick({ key: "manageBills" });
          },
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        width: isCollapsed ? "80px" : "280px",
        height: "calc(100vh - 32px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
        borderRight: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#e2e8f0"}`,
        boxShadow: "0px 4px 30px rgba(0,0,0,0.03)",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 16,
        left: 16,
        margin: "16px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Header (Logo + Title) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          alignItems: "center",
          px: isCollapsed ? 1 : 2.5,
          py: 2,
          height: "70px",
        }}
      >
        {!isCollapsed && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "#ea580c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#fff" }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.5px",
                color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
              }}
            >
              OrangeFarm
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: "text.secondary" }}>
          <MenuOutlined />
        </IconButton>
      </Box>

      {/* Search Input (Under Header) */}
      {!isCollapsed && (
        <Box sx={{ px: 2.5, pb: 2 }}>
          <TextField
            placeholder="Tìm kiếm..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "10px",
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "#f8fafc",
                fontSize: "0.85rem",
                "& fieldset": {
                  borderColor: theme.palette.mode === "dark" ? "#1e293b" : "#e2e8f0",
                },
              },
            }}
          />
        </Box>
      )}
      {isCollapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
          <IconButton sx={{ color: "#94a3b8" }}>
            <SearchIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      )}

      {/* Menu Items list */}
      <Box sx={{ overflowY: "auto", flexGrow: 1, px: 1.5, pb: 2 }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {menuItems.map((item) => {
            const isMenuSelected = selected === item.title;
            return (
              <Box key={item.title}>
                {item.submenu ? (
                  <>
                    <ListItemButton
                      onClick={() => handleSubmenuToggle(item.title.toLowerCase())}
                      sx={{
                        minHeight: 44,
                        borderRadius: "10px",
                        justifyContent: isCollapsed ? "center" : "initial",
                        px: 2,
                        color: theme.palette.mode === "dark" ? "#94a3b8" : "#475569",
                        "&:hover": {
                          bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isCollapsed ? 0 : 2,
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <>
                          <ListItemText
                            primary={item.title}
                            primaryTypographyProps={{ fontSize: "0.92rem", fontWeight: 600 }}
                          />
                          {openSubmenus[item.title.toLowerCase()] ? (
                            <ExpandLess sx={{ fontSize: 18 }} />
                          ) : (
                            <ExpandMore sx={{ fontSize: 18 }} />
                          )}
                        </>
                      )}
                    </ListItemButton>
                    <Collapse
                      in={!isCollapsed && openSubmenus[item.title.toLowerCase()]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding sx={{ mt: 0.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {item.submenu.map((subItem) => {
                          const isSubSelected = selected === subItem.title;
                          return (
                            <ListItemButton
                              key={subItem.title}
                              selected={isSubSelected}
                              onClick={subItem.onClick}
                              sx={{
                                pl: 4,
                                pr: 2,
                                minHeight: 40,
                                borderRadius: "8px",
                                color: isSubSelected ? "#ea580c" : "text.secondary",
                                bgcolor: isSubSelected ? "rgba(234, 88, 12, 0.08)" : "transparent",
                                "&.Mui-selected": {
                                  bgcolor: isSubSelected ? "rgba(234, 88, 12, 0.08)" : "transparent",
                                  color: "#ea580c",
                                  "&:hover": {
                                    bgcolor: isSubSelected ? "rgba(234, 88, 12, 0.12)" : "transparent",
                                  },
                                },
                                "&:hover": {
                                  color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
                                  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 2,
                                  color: "inherit",
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "1.2rem",
                                }}
                              >
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={subItem.title}
                                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 550 }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    selected={isMenuSelected}
                    onClick={item.onClick}
                    sx={{
                      minHeight: 44,
                      borderRadius: "10px",
                      justifyContent: isCollapsed ? "center" : "initial",
                      px: 2,
                      color: isMenuSelected ? "#ea580c" : "text.secondary",
                      bgcolor: isMenuSelected ? "rgba(234, 88, 12, 0.08)" : "transparent",
                      "&.Mui-selected": {
                        bgcolor: isMenuSelected ? "rgba(234, 88, 12, 0.08)" : "transparent",
                        color: "#ea580c",
                      },
                      "&:hover": {
                        color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
                        bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 2,
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{ fontSize: "0.92rem", fontWeight: 600 }}
                      />
                    )}
                  </ListItemButton>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Bottom Profile Section with Settings & Logout */}
      <Box sx={{ mt: "auto", p: 2, borderTop: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#f1f5f9"}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, mb: 1, justifyContent: isCollapsed ? "center" : "flex-start" }}>
          <Avatar
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            sx={{ width: 38, height: 38, border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          />
          {!isCollapsed && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                Harry Nguyen
              </Typography>
              <Chip
                label="Admin"
                size="small"
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#b45309",
                  fontWeight: "bold",
                  height: 18,
                  fontSize: "0.65rem",
                  mt: 0.2,
                }}
              />
            </Box>
          )}
        </Box>

        <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {/* Settings / Toggle Theme */}
          <ListItemButton
            onClick={colorMode.toggleColorMode}
            sx={{
              minHeight: 38,
              borderRadius: "8px",
              justifyContent: isCollapsed ? "center" : "initial",
              px: 1.5,
              color: "text.secondary",
              "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 1.5, color: "inherit" }}>
              <SettingsIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Cấu hình"
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
              />
            )}
          </ListItemButton>

          {/* Log out */}
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              minHeight: 38,
              borderRadius: "8px",
              justifyContent: isCollapsed ? "center" : "initial",
              px: 1.5,
              color: "#ef4444",
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.05)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 1.5, color: "inherit" }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Đăng xuất"
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
};

export default AppSider;
