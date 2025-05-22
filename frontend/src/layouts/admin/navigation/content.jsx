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
          minHeight: "calc(100px - 100  px)",
          overflowX: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppContent;
