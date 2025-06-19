import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { StudentSideBar } from "../components/SideBar/StudentSideBar";
import { IconButton, Grid, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/zeenlogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Logout } from "@mui/icons-material";
import StudentNavBar from "../components/StudentPortal/StudentNavBar";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const drawerWidth = 200;

const Student_portal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("DASHBOARD");
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    // Set a timer to delete the token after a certain time (e.g., 30 minutes)
    const tokenExpirationTime = 365 * 24 * 60 * 60 * 1000; // 30 minutes in milliseconds
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
      sx={{ display: "flex", backgroundColor: "#f5f0f0", minHeight: "100vh" }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarOpen ? drawerWidth : "20px",
          flexShrink: 0,
          transition: "width 0.3s ease",
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
          width: `calc(100% - ${sidebarOpen ? drawerWidth : 60}px)`,
          transition: "margin 0.3s ease",
        }}
      >
        {/* Width changes based on the sidebarOpen state */}
        <StudentNavBar selectedMenuItem={selectedMenuItem} />
        {/* TOGGLE SIDEBAR BUTTON */}
        {/* <div
          className={`w-12 h-12 rounded-full absolute shadow-lg z-20`}
          style={{
            top: sidebarOpen ? "46px" : "650px",
            left: sidebarOpen ? "170px" : "4px", // Adjust left dynamically
            transition: "left 0.3s ease", // Smooth animation
          }}
        >
          <IconButton
            style={{
              backgroundColor: "#14475a",
              color: "black",
            }}
            onClick={handleSidebarToggle}
            sx={{
              m: 1,
            }}
          >
            {sidebarOpen ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </IconButton>
        </div> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Student_portal;
