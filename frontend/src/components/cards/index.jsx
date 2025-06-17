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
          borderRadius: 2,
          borderColor: colors.grey[100],
          boxShadow:
            boxShadow && !border
              ? `0px 2px 8px ${alpha(colors.grey[300], 0.15)}`
              : "inherit",
          ":hover": {
            boxShadow: boxShadow
              ? `0px 2px 8px ${alpha(colors.grey[300], 0.5)}`
              : "inherit",
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
