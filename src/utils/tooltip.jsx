import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

// Create a custom styled tooltip
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    enterDelay={2000} // 2s delay on first hover
    enterNextDelay={2000} // 2s delay on next hovers
    placement={props.placement || "bottom"} // default to bottom if not provided
    TransitionProps={{ timeout: 500 }} // 0.5s fade animation
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--color-main)", // white background
    color: "white", // softer black text
    fontSize: "0.6rem", //0.9 modern small size
    padding: "4px 6px", //8-12 more breathing space
    border: "1px solid #e0e0e0", // lighter subtle border
    borderRadius: "8px", // rounded corners
    // boxShadow: theme.shadows[1], // stronger modern shadow
    fontWeight: 500, // slight bold
    letterSpacing: "0.3px", // cleaner text
    transition: "all 0.3s ease",
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.6rem", // adjust font size on larger screens
    },
  },
}));

export default CustomTooltip;
//!To use
{
  /* <CustomTooltip
  title={name}
  placement="top"
  enterDelay={2000}
  enterNextDelay={2000}
  TransitionProps={{ timeout: 500 }} // optional: fade in 0.5s
> */
}
