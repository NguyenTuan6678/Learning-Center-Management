import { useState, useMemo } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {
  HomeOutlined,
  PeopleOutlined,
  MenuOutlined,
  CalendarTodayOutlined,
  AssignmentOutlined,
  SchoolOutlined,
  ReceiptOutlined,
  AssessmentOutlined,
  PaymentOutlined,
  HistoryOutlined,
  GradeOutlined,
  BookOutlined,
  MonetizationOnOutlined,
} from "@mui/icons-material";
import { tokens } from "../../../themes/theme";
import logo from "../../../assets/imgs/small45.png";

const SidebarItem = ({
  title,
  icon,
  selected,
  setSelected,
  onClickKey,
  to,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClick = () => {
    setSelected(title);
    onClickKey?.();
  };

  return (
    <MenuItem
      icon={icon}
      style={{ color: colors.grey[100] }}
      active={selected === title}
      onClick={handleClick}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SidebarHeader = ({ isCollapsed, setIsCollapsed, colors }) => {
  return (
    <MenuItem
      onClick={() => setIsCollapsed(!isCollapsed)}
      icon={isCollapsed ? <MenuOutlined /> : undefined}
      style={{
        margin: "10px 0 20px 0",
        color: colors.grey[100],
      }}
    >
      {!isCollapsed && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml="15px"
        >
          <div className="logo" style={{ width: 30, height: 30 }}>
            <img src={logo} alt="Logo" />
          </div>
          <Typography variant="h3" color={colors.grey[100]}>
            STUDENT
          </Typography>
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            <MenuOutlined />
          </IconButton>
        </Box>
      )}
    </MenuItem>
  );
};

const UserProfile = ({ isCollapsed, colors }) => {
  if (isCollapsed) return null;

  return (
    <Box mb="25px" textAlign="center">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "10px 0 0 0" }}
      >
        Harry Nguyen
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[500]}>
        Student
      </Typography>
    </Box>
  );
};

const menuItems = [
  {
    title: "Tổng quan",
    icon: <HomeOutlined />,
    key: "dashboard",
    to: "/dashboard",
  },
  {
    title: "Lịch học",
    icon: <CalendarTodayOutlined />,
    key: "manageStudents",
    to: "/calendar",
  },
  {
    title: "Học tập",
    icon: <SchoolOutlined />,
    isSubMenu: true,
    items: [
      {
        title: "Đăng ký môn học",
        icon: <BookOutlined />,
        key: "enrollmentClass",
        to: "/register",
      },
      {
        title: "Bảng điểm",
        icon: <GradeOutlined />,
        key: "record",
        to: "/record",
      },
      {
        title: "Đánh giá học tập",
        icon: <AssessmentOutlined />,
        key: "reviews",
        to: "/reviews",
      },
    ],
  },
  {
    title: "Học phí",
    icon: <MonetizationOnOutlined />,
    isSubMenu: true,
    items: [
      {
        title: "Hoá đơn học phí",
        icon: <ReceiptOutlined />,
        key: "manageBills",
        to: "/bills",
      },
      {
        title: "Lịch sử thanh toán",
        icon: <HistoryOutlined />,
        key: "manageBillsHistory",
        to: "/paymentHistory",
      },
    ],
  },
];

const AppSider1 = ({ onMenuItemClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const sidebarStyles = useMemo(
    () => ({
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
    }),
    [colors.primary]
  );

  const renderMenuItems = () => {
    return menuItems.map((item) => {
      if (item.isSubMenu) {
        return (
          <SubMenu
            key={item.title}
            label={item.title}
            icon={item.icon}
            style={{ color: colors.grey[100] }}
          >
            {item.items.map((subItem) => (
              <SidebarItem
                key={subItem.key}
                title={subItem.title}
                icon={subItem.icon}
                selected={selected}
                setSelected={setSelected}
                onClickKey={() => onMenuItemClick({ key: subItem.key })}
                to={subItem.to}
              />
            ))}
          </SubMenu>
        );
      }

      return (
        <SidebarItem
          key={item.key}
          title={item.title}
          icon={item.icon}
          selected={selected}
          setSelected={setSelected}
          onClickKey={() => onMenuItemClick({ key: item.key })}
          to={item.to}
        />
      );
    });
  };

  return (
    <Box sx={sidebarStyles}>
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <SidebarHeader
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            colors={colors}
          />

          <UserProfile isCollapsed={isCollapsed} colors={colors} />

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {renderMenuItems()}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AppSider1;
