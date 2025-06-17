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
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(theme.direction === "rtl" && {}),
      }}
    >
      <Box
        sx={{
          // p: 3,
          minHeight: "calc(100px - 100  px)",
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
