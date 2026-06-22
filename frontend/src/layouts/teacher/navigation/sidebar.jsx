import { useState, useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  HomeOutlined,
  PeopleOutlined,
  PersonOutlined,
  MenuOutlined,
  ExpandLess,
  ExpandMore,
  AccountCircle,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
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
      title: "Quản lý lớp học",
      icon: <PersonOutlined />,
      submenu: [
        {
          title: "Lớp đang dạy",
          icon: <PeopleOutlined />,
          key: "manageAccounts",
          onClick: () => {
            setSelected("Lớp đang dạy");
            onMenuItemClick({ key: "teacherClasses" });
          },
        },
      ],
    },
    {
      title: "Quản lý học sinh",
      icon: <PersonOutlined />,
      submenu: [
        {
          title: "Đánh giá học tập",
          icon: <PeopleOutlined />,
          key: "manageCourses",
          onClick: () => {
            setSelected("Đánh giá học tập");
            // onMenuItemClick({ key: "manageCourses" });
          },
        },
        {
          title: "Đánh giá nhận xét",
          icon: <PeopleOutlined />,
          key: "manageClasses",
          onClick: () => {
            setSelected("Đánh giá nhận xét");
            // onMenuItemClick({ key: "manageClasses" });
          },
        },
      ],
    },
    // {
    //   title: "Học sinh",
    //   icon: <PeopleOutlined />,
    //   submenu: [
    //     {
    //       title: "Quản lý học sinh",
    //       icon: <PeopleOutlined />,
    //       key: "manageStudents",
    //       onClick: () => {
    //         setSelected("Quản lý học sinh");
    //         onMenuItemClick({ key: "manageStudents" });
    //       },
    //     },
    //     {
    //       title: "Quản lý kết quả học tập",
    //       icon: <PeopleOutlined />,
    //       key: "manageLearningOutcomes",
    //       onClick: () => {
    //         setSelected("Quản lý kết quả học tập");
    //         onMenuItemClick({ key: "manageLearningOutcomes" });
    //       },
    //     },
    //     {
    //       title: "Quản lý nhận xét",
    //       icon: <PeopleOutlined />,
    //       key: "manageAdminReviews",
    //       onClick: () => {
    //         setSelected("Quản lý nhận xét");
    //         onMenuItemClick({ key: "manageAdminReviews" });
    //       },
    //     },
    //   ],
    // },
    // {
    //   title: "Giáo viên",
    //   icon: <PeopleOutlined />,
    //   submenu: [
    //     {
    //       title: "Quản lý giáo viên",
    //       icon: <PeopleOutlined />,
    //       key: "manageTeachers",
    //       onClick: () => {
    //         setSelected("Quản lý giáo viên");
    //         onMenuItemClick({ key: "manageTeachers" });
    //       },
    //     },
    //   ],
    // },
    // {
    //   title: "Phụ huynh",
    //   icon: <PeopleOutlined />,
    //   submenu: [
    //     {
    //       title: "Quản lý phụ huynh",
    //       icon: <PeopleOutlined />,
    //       key: "manageParents",
    //       onClick: () => {
    //         setSelected("Quản lý phụ huynh");
    //         onMenuItemClick({ key: "manageParents" });
    //       },
    //     },
    //   ],
    // },
    // {
    //   title: "Hoá đơn",
    //   icon: <PeopleOutlined />,
    //   submenu: [
    //     {
    //       title: "Quản lý hoá đơn",
    //       icon: <PeopleOutlined />,
    //       key: "manageBills",
    //       onClick: () => {
    //         setSelected("Quản lý hoá đơn");
    //         onMenuItemClick({ key: "manageBills" });
    //       },
    //     },
    //   ],
    // },
  ];

  return (
    <Box
      sx={{
        width: isCollapsed ? "80px" : "260px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff",
        borderRight: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#e2e8f0"}`,
        boxShadow: "4px 0 20px rgba(0,0,0,0.01)",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          alignItems: "center",
          px: isCollapsed ? 1 : 2.5,
          py: 2,
          height: "70px",
          borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#f1f5f9"}`,
        }}
      >
        {!isCollapsed && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <img src={logo} alt="Logo" style={{ width: 32, height: 32, borderRadius: "6px" }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "0.5px", color: theme.palette.mode === "dark" ? "#fff" : "#15803d" }}>
              TEACHER
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b" }}>
          <MenuOutlined />
        </IconButton>
      </Box>

      {/* User Profile */}
      {!isCollapsed && (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#f1f5f9"}`,
          }}
        >
          <Box sx={{ position: "relative", mb: 1.5 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#ea580c",
                fontSize: "1.5rem",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                border: "2px solid #fff",
              }}
            >
              GV
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#10b981",
                border: "2px solid #fff",
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
            }}
          >
            Nguyễn Văn Giáo Viên
          </Typography>
          <Typography variant="h6" sx={{ color: colors.greenAccent[500], fontWeight: 600, mt: 0.5 }}>
            Giáo viên
          </Typography>
        </Box>
      )}

      {/* Menu Items */}
      <Box sx={{ overflowY: "auto", flexGrow: 1, px: 1.5, py: 2 }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {menuItems.map((item) => (
            <Box key={item.title}>
              {item.submenu ? (
                <>
                  <ListItemButton
                    onClick={() =>
                      handleSubmenuToggle(item.title.toLowerCase())
                    }
                    sx={{
                      minHeight: 44,
                      borderRadius: "10px",
                      justifyContent: isCollapsed ? "center" : "initial",
                      px: 2,
                      color: theme.palette.mode === "dark" ? "#94a3b8" : "#475569",
                      "&:hover": {
                        bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
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
                          primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 600 }}
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
                        const isSelected = selected === subItem.title;
                        return (
                          <ListItemButton
                            key={subItem.title}
                            selected={isSelected}
                            onClick={subItem.onClick}
                            sx={{
                              pl: 4,
                              pr: 2,
                              minHeight: 40,
                              borderRadius: "8px",
                              color: isSelected 
                                ? (theme.palette.mode === "dark" ? "#fff" : "#ea580c")
                                : (theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"),
                              bgcolor: isSelected 
                                ? (theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.08)")
                                : "transparent",
                              "&.Mui-selected": {
                                bgcolor: isSelected 
                                  ? (theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.08)")
                                  : "transparent",
                                "&:hover": {
                                  bgcolor: isSelected 
                                    ? (theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.25)" : "rgba(234, 88, 12, 0.12)")
                                    : "transparent",
                                }
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
                  selected={selected === item.title}
                  onClick={item.onClick}
                  sx={{
                    minHeight: 44,
                    borderRadius: "10px",
                    justifyContent: isCollapsed ? "center" : "initial",
                    px: 2,
                    color: selected === item.title
                      ? (theme.palette.mode === "dark" ? "#fff" : "#ea580c")
                      : (theme.palette.mode === "dark" ? "#94a3b8" : "#475569"),
                    bgcolor: selected === item.title
                      ? (theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.08)")
                      : "transparent",
                    "&.Mui-selected": {
                      bgcolor: selected === item.title
                        ? (theme.palette.mode === "dark" ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.08)")
                        : "transparent",
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
                      primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 600 }}
                    />
                  )}
                </ListItemButton>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Bottom Settings & Logout Section */}
      <Box sx={{ mt: "auto", p: 2, borderTop: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#f1f5f9"}` }}>
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
