import React from "react";
import { Box, Typography, Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import CelebrationIcon from "@mui/icons-material/Celebration";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44B700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(0.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Box1 = () => {
  const user = localStorage.getItem("donor_name");
  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa, #80deea)",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar
          alt="Profile pic"
          src={user}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid #fff",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </StyledBadge>
      <Box sx={{ ml: 3 }}>
        <CelebrationIcon sx={{ color: "#FFD700" }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#004d40",
          }}
        >
          Welcome back, {user}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontStyle: "italic",
            opacity: 0.9,
          }}
        >
          Here is your impact at a glance.
        </Typography>
      </Box>
    </Box>
  );
};

export default Box1;
