// theme.js or theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640, // <-- Match Tailwind!
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});
