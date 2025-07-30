import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarOne } from "../components/SideBar/DonorSideBar";
import DonorNavBar from "../components/DonorPortal/Navbar";
import { Box, IconButton } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const drawerWidth = 210;

const DonorPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("DASHBOARD");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const tokenExpirationTime = 2 * 60 * 60 * 1000;
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, tokenExpirationTime);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
        <SidebarOne
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
        <DonorNavBar
          selectedMenuItem={selectedMenuItem}
          sidebarOpen={sidebarOpen}
        />

        {/* Toggle Button */}
        <IconButton
          onClick={handleSidebarToggle}
          sx={{
            position: "fixed",
            top: sidebarOpen ? "95px" : "54px",
            left: sidebarOpen ? drawerWidth - 34 : -15,
            zIndex: 9999,
            backgroundColor: "#14475a",
            color: "white",
            transition: "left 0.3s ease",
            ":hover": {
              backgroundColor: "#145753",
              color: "white",
            },
          }}
        >
          {sidebarOpen ? (
            <KeyboardDoubleArrowLeftIcon />
          ) : (
            <KeyboardDoubleArrowRightIcon />
          )}
        </IconButton>

        {/* Outlet View */}
        <Box sx={{ mt: "70px", px: "10px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DonorPortal;
