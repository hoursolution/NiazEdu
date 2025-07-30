import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase"; // Not used in the provided context, but kept for completeness
import Badge from "@mui/material/Badge"; // Not used in the provided context, but kept for completeness
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications"; // Not used in the provided context, but kept for completeness
import MoreIcon from "@mui/icons-material/MoreVert";
import dashboardIcon from "../../assets/Dashboard.png"; // Renamed to avoid conflict with prop
import logoutIcon from "../../assets/logout2.png"; // Renamed to avoid conflict with prop
import { useNavigate } from "react-router-dom";
import { Tooltip, Grid, Select, FormControl, InputLabel } from "@mui/material"; // Not all used, but kept for completeness
import { CheckCircle, Error, HourglassEmpty } from "@mui/icons-material"; // Not used, but kept for completeness
import { motion } from "framer-motion"; // Import motion for animations

const drawerWidth = 190;

export default function StudentNavBar({ selectedMenuItem, sidebarOpen }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Color scheme (matching the sidebar)
  const navbarBg = "#056da1"; // Mint to soft blueberry
  const textColor = "white"; // Gray-200
  const iconColor = "#e5e7eb"; // Gray-200 for icons

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Your actual logout logic (API call, token removal, etc.)
    // For now, just navigate to login
    navigate("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom", // Changed to bottom for a more modern dropdown feel
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: navbarBg, // Match navbar background
          color: textColor,
          borderRadius: "8px",
          // boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <MenuItem
        onClick={handleMenuClose}
        sx={{ "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" } }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        sx={{ "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" } }}
      >
        My account
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom", // Changed to bottom
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: navbarBg, // Match navbar background
          color: textColor,
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <MenuItem
        onClick={handleLogout}
        sx={{ "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" } }}
      >
        <IconButton size="large" aria-label="logout" color="inherit">
          <img
            src={logoutIcon}
            alt="Logout"
            className="w-4 filter brightness-0 invert"
          />{" "}
          {/* Invert for dark background */}
        </IconButton>
        <p>Logout</p>
      </MenuItem>
      {/* Notifications icon from original context, but not used in the provided code logic */}
      {/* <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon sx={{ color: iconColor }} />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem
        onClick={handleProfileMenuOpen}
        sx={{ "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" } }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle sx={{ color: iconColor }} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: navbarBg,
          height: "50px",
          zIndex: 1000,
          left: sidebarOpen ? `${drawerWidth}px` : 0,
          width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: "width 0.3s ease, left 0.3s ease",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
        }}
      >
        <Toolbar
          sx={{
            minHeight: "50px !important",
            px: 1,
          }}
        >
          {/* Dashboard Icon (leftmost) */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 1 }}
            >
              <img
                src={dashboardIcon}
                alt="Dashboard"
                className="w-4 filter brightness-0 invert"
              />{" "}
              {/* Invert for dark background */}
            </IconButton>
          </motion.div>

          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: "bold",
              fontSize: 16,
              color: textColor,
              letterSpacing: "0.5px",
            }}
          >
            {selectedMenuItem}
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Logout and Profile (Desktop) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <IconButton
                size="large"
                aria-label="logout"
                color="inherit"
                onClick={handleLogout}
                sx={{ p: "6px" }} // Adjust padding for better click area
              >
                <img
                  src={logoutIcon}
                  alt="Logout"
                  className="w-4 filter brightness-0 invert" // Invert for dark background
                />
              </IconButton>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ p: "6px" }} // Adjust padding
              >
                <AccountCircle sx={{ color: iconColor }} />
              </IconButton>
            </motion.div>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ p: "6px" }} // Adjust padding
              >
                <MoreIcon sx={{ color: iconColor }} />
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
