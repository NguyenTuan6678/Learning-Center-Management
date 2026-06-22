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
        py: 2.5,
        px: 2,
        mt: "auto", // Push footer to bottom of flex container
        textAlign: "center",
        color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
        borderTop: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#e2e8f0"}`,
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
