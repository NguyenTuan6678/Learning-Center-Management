import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../themes/theme";

const AppContent = ({ children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: colors.primary[400],
        flexGrow: 1,
        // p: 3,
        // mt: { xs: "0", sm: "0" }, // Điều chỉnh theo chiều cao header
        // ml: { xs: "10px", sm: "10px" }, // Điều chỉnh theo chiều rộng sidebar
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(theme.direction === "rtl" &&
          {
            // mr: { sm: "250px" },
            // ml: { sm: 0 },
          }),
      }}
    >
      <Box
        sx={{
          // p: 3,
          minHeight: "calc(100px - 100  px)", // Điều chỉnh theo layout
          // backgroundColor: colors.primary[400],
          // borderRadius: "12px",
          // maxWidth: "1200px",
          // mx: "auto",
          overflowX: "auto",
          // boxShadow: theme.shadows[2],
          // border: `1px solid ${colors.primary[300]}`,
          // color: colors.grey[100],
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppContent;
