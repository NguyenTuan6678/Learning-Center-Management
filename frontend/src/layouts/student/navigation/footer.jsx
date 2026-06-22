import { Box, Typography, useTheme } from "@mui/material";

const AppFooter1 = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 2.5,
        px: 2,
        mt: "auto", // Push footer to bottom
        textAlign: "center",
        color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
        borderTop: `1px solid ${theme.palette.mode === "dark" ? "#1e293b" : "#e2e8f0"}`,
      }}
    >
      <Typography variant="body2">
        ©{new Date().getFullYear()} Created by Harry Nguyen
      </Typography>
    </Box>
  );
};

export default AppFooter1;
