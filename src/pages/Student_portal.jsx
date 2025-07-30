import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { StudentSideBar } from "../components/SideBar/StudentSideBar";
import { IconButton, Grid, Box, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/zeenlogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Logout } from "@mui/icons-material";
import StudentNavBar from "../components/StudentPortal/StudentNavBar";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const drawerWidthOpen = 210;
const drawerWidthClosed = 20;

const Student_portal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("DASHBOARD");
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const tokenExpirationTime = 365 * 24 * 60 * 60 * 1000; // 1 year
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, tokenExpirationTime);

    return () => clearTimeout(timer);
  }, [navigate]);

  const drawerWidth = sidebarOpen ? drawerWidthOpen : drawerWidthClosed;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    // Set a timer to delete the token after a certain time (e.g., 30 minutes)
    const tokenExpirationTime = 2 * 60 * 60 * 1000; // 30 minutes in milliseconds
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, tokenExpirationTime);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSidebarToggle = () => {
    setOpen(!open);
    setSidebarOpen(!sidebarOpen);
  };
  const handleMenuItemClick = (text) => {
    setSelectedMenuItem(text);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to the login page if the user is not authenticated
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "rgba(255, 255, 255, 0.65)",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: `${drawerWidth}px`,
          flexShrink: 0,
          transition: "width 0.3s ease",
          height: "100vh",
          position: "fixed",
          zIndex: 1200,
        }}
      >
        <StudentSideBar
          isOpen={sidebarOpen}
          onClose={handleSidebarToggle}
          selectedMenuItem={selectedMenuItem}
          handleMenuItemClick={setSelectedMenuItem}
        />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${drawerWidth}px`,
          transition: "margin-left 0.3s ease",
          overflow: "hidden", // prevent horizontal scroll
          width: `calc(100vw - ${drawerWidth}px)`, // explicitly limit width
          position: "relative",
        }}
      >
        {/* Width changes based on the sidebarOpen state */}
        <StudentNavBar selectedMenuItem={selectedMenuItem} />

        {/* Toggle Button */}
        <Box
          sx={{
            position: "fixed",
            top: "240px",
            left: sidebarOpen
              ? `${drawerWidthOpen - 38}px`
              : `${drawerWidthClosed - 25}px`,
            zIndex: 1400,
            transition: "left 0.3s ease",
          }}
        >
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              backgroundColor: "#cce7ff",
              color: "#1E3A8A",
              width: "26px",
              height: "52px",
              borderTopLeftRadius: "50%",
              borderBottomLeftRadius: "50%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: "4px 0 12px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#b2dbff",
              },
              transition: "all 0.3s ease",
            }}
          >
            {sidebarOpen ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)", // space for navbar
            paddingTop: "64px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            overflow: "auto", // allow scroll if content is large, but no x-scroll
            paddingX: "12px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Student_portal;
