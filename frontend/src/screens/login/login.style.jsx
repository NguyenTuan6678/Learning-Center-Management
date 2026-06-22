import { Box } from "@mui/material";

export const AuthWrapper = ({ children, artworkSrc }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "#111827", // Dark background to match screenshot
      p: { xs: 2, sm: 3, md: 4 },
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: 450, md: 950 },
        bgcolor: "#ffffff",
        borderRadius: "28px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" }, // Mobile: image on top of form (row-reverse if layout order changes, or column-reverse so form is below image when artwork is on right)
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Form content (Left column on desktop, Bottom column on mobile) */}
      <Box
        sx={{
          flex: 1.1,
          p: { xs: 4, sm: 5, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>

      {/* Artwork Panel (Right column on desktop, Top banner on mobile) */}
      <Box
        sx={{
          flex: 0.9,
          p: { xs: 2, md: 2.5 },
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={artworkSrc}
          alt="Login Artwork"
          sx={{
            width: "100%",
            height: { xs: 200, sm: 260, md: "100%" },
            minHeight: { md: 540 },
            objectFit: "cover",
            borderRadius: "20px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
          }}
        />
      </Box>
    </Box>
  </Box>
);
