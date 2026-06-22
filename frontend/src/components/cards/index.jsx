import { Card, colors } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { forwardRef } from "react";

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentSX = {},
      darkTitle,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          border: border ? "1px solid" : "none",
          borderRadius: "16px",
          borderColor: (theme) => theme.palette.mode === "dark" ? "#1e293b" : "#f1f5f9",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.015), 0px 2px 4px rgba(0,0,0,0.01)",
          backgroundImage: "none",
          bgcolor: (theme) => theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: boxShadow
              ? "0px 10px 25px rgba(0,0,0,0.08)"
              : "0px 4px 20px rgba(0,0,0,0.015), 0px 2px 4px rgba(0,0,0,0.01)",
          },
          "& pre": {
            m: 0,
            p: "16px !important",
            fontSize: "0.75rem",
          },
          ...sx,
        }}
      >
        {children}
      </Card>
    );
  }
);

export default MainCard;
