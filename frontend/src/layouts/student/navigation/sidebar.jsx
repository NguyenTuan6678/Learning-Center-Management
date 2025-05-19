import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { tokens } from "../../../themes/theme";
import logo from "../../../assets/imgs/small45.png";

const Item = ({ title, icon, selected, setSelected, onClickKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      icon={icon}
      style={{ color: colors.grey[100] }}
      active={selected === title}
      onClick={() => {
        setSelected(title);
        onClickKey();
      }}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const AppSider = ({ onMenuItemClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

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
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
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
                  <img src={logo} />
                </div>
                <Typography variant="h3" color={colors.grey[100]}>
                  STUDENT
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Box>
              <Box textAlign="center">
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
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Tổng quan  "
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Lịch học"
              to="/calendar"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              onClickKey={() => onMenuItemClick({ key: "manageStudents" })}
            />

            <SubMenu label="Học tập">
              <Item
                title="Đăng ký môn học"
                to="/regsister"
                // icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Bảng điểm"
                to="/record"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Đánh giá học tập"
                to="/reviews"
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu label="Học phí">
              <Item
                title="Hoá đơn học phí"
                to="/bills"
                // icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                onClickKey={() => onMenuItemClick({ key: "manageBills" })}
              />
              <Item
                title="Lịch sử thanh toán"
                to="/paymentHistory"
                // icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                onClickKey={() =>
                  onMenuItemClick({ key: "manageBillsHistory" })
                }
              />
            </SubMenu>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AppSider;
