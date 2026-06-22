import { Home, Person, Receipt } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../themes/theme";

const breadcrumbMap = {
  dashboard: [{ label: "Tổng quan" }],
  manageStudents: [
    {
      label: "Học Sinh",
      icon: <Person fontSize="small" />,
    },
    { label: "Danh sách học sinh" },
  ],
  manageAccounts: [
    {
      label: "Tài khoản",
      icon: <Person fontSize="small" />,
    },
    { label: "Danh sách tài khoản" },
  ],
  manageParents: [
    {
      label: "Phụ huynh",
      icon: <Person fontSize="small" />,
    },
    { label: "Danh sách phụ huynh" },
  ],
  manageTeachers: [
    {
      label: "Giáo viên",
      icon: <Person fontSize="small" />,
    },
    { label: "Danh sách giáo viên" },
  ],
  manageBills: [
    {
      label: "Hoá đơn",
      icon: <Receipt fontSize="small" />,
    },
    { label: "Danh sách hoá đơn" },
  ],
};

const BreadCrumb = ({ selectedMenuItem }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getBreadcrumbItems = () => {
    const baseItems = [
      {
        label: "Trang chủ",
        icon: <Home fontSize="small" sx={{ color: colors.grey[100] }} />,
        href: "",
      },
    ];
    const additionalItems = breadcrumbMap[selectedMenuItem] || [];
    return [...baseItems, ...additionalItems];
  };

  const items = getBreadcrumbItems();

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <Typography
            component="span"
            sx={{
              color: colors.grey[300],
              mx: 0.5,
            }}
          >
            ›
          </Typography>
        }
      >
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              color:
                index < items.length - 1
                  ? colors.grey[100]
                  : "#ea580c",
            }}
          >
            {item.icon && (
              <Box
                sx={{
                  display: "flex",
                  mr: 1,
                  color: "inherit",
                }}
              >
                {item.icon}
              </Box>
            )}
            {index < items.length - 1 ? (
              <Link
                href={item.href || "#"}
                underline="hover"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                  "&:hover": {
                    color: "#ea580c",
                  },
                }}
              >
                {item.label}
              </Link>
            ) : (
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "inherit",
                }}
              >
                {item.label}
              </Typography>
            )}
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadCrumb;
