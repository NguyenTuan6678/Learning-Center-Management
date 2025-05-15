import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../themes/theme";

const AppFooter = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 3,
        px: 2,
        textAlign: "center",
        color: colors.grey[100],
        backgroundColor: colors.primary[400],
        borderTop: `1px solid ${colors.primary[500]}`,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["background-color", "color"], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Typography variant="body2">
        ©{new Date().getFullYear()} Created by Harry Nguyen
      </Typography>
    </Box>
  );
};

export default AppFooter;
