import { useState } from "react";
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
} from "@mui/material";
import {
  HomeOutlined,
  PeopleOutlined,
  PersonOutlined,
  MenuOutlined,
  ExpandLess,
  ExpandMore,
  AccountCircle,
} from "@mui/icons-material";
import { tokens } from "../../../themes/theme";
import logo from "../../../assets/imgs/small45.png";

const AppSider = ({ onMenuItemClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
        ".ps-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        ".ps-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        ".ps-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        ".ps-inner-item:hover": {
          color: "#868dfb !important",
        },
        ".ps-menu-item.active": {
          color: "#6870fa !important",
        },
        width: isCollapsed ? "80px" : "250px",
        height: "100vh",
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          height: "70px",
        }}
      >
        {!isCollapsed && (
          <Box display="flex" alignItems="center" gap={1}>
            <img src={logo} alt="Logo" style={{ width: 30, height: 30 }} />
            <Typography variant="h3" color={colors.grey[100]}>
              ADMIN
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuOutlined sx={{ color: colors.grey[100] }} />
        </IconButton>
      </Box>

      {/* User Profile */}
      {!isCollapsed && (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
          }}
        >
          <AccountCircle sx={{ fontSize: 60, color: colors.grey[100] }} />
          <Typography
            variant="h3"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            Harry Nguyen
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[500]}>
            Admin
          </Typography>
        </Box>
      )}

      {/* Menu Items */}
      <Box sx={{ overflow: "auto", flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <Box key={item.title}>
              {item.submenu ? (
                <>
                  <ListItemButton
                    onClick={() =>
                      handleSubmenuToggle(item.title.toLowerCase())
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: isCollapsed ? "center" : "initial",
                      px: 2.5,
                      color: colors.grey[100],
                      "&:hover": {
                        color: "#868dfb",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? "auto" : 3,
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <>
                        <ListItemText primary={item.title} />
                        {openSubmenus[item.title.toLowerCase()] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </>
                    )}
                  </ListItemButton>
                  <Collapse
                    in={!isCollapsed && openSubmenus[item.title.toLowerCase()]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.submenu.map((subItem) => (
                        <ListItemButton
                          key={subItem.title}
                          selected={selected === subItem.title}
                          onClick={subItem.onClick}
                          sx={{
                            pl: 4,
                            color: colors.grey[100],
                            "&.Mui-selected": {
                              color: "#6870fa",
                              backgroundColor: "transparent",
                            },
                            "&:hover": {
                              color: "#868dfb",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{ minWidth: 0, mr: 3, color: "inherit" }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton
                  selected={selected === item.title}
                  onClick={item.onClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: isCollapsed ? "center" : "initial",
                    px: 2.5,
                    color: colors.grey[100],
                    "&.Mui-selected": {
                      color: "#6870fa",
                      backgroundColor: "transparent",
                    },
                    "&:hover": {
                      color: "#868dfb",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? "auto" : 3,
                      color: "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.title} />}
                </ListItemButton>
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default AppSider;
