import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarOne } from "../components/SideBar/AdminSideBar";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import AdminNAvBar from "../components/Admin/Navbar";

const drawerWidthOpen = 210;
const drawerWidthClosed = 20;

const Admin_portal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("DASHBOARD");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const tokenExpirationTime = 365 * 24 * 60 * 60 * 1000; // 1 year
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, tokenExpirationTime);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const drawerWidth = sidebarOpen ? drawerWidthOpen : drawerWidthClosed;

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f0f0", height: "100vh" }}>
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
        <SidebarOne
          isOpen={sidebarOpen}
          onClose={handleSidebarToggle}
          selectedMenuItem={selectedMenuItem}
          handleMenuItemClick={setSelectedMenuItem}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: `${drawerWidth}px`,
          transition: "margin-left 0.3s ease",
          height: "100vh",
          overflow: "auto",
          position: "relative",
          // marginTop: "60px",
        }}
      >
        <AdminNAvBar
          selectedMenuItem={selectedMenuItem}
          sidebarOpen={sidebarOpen}
        />

        {/* Toggle Button */}
        <Box
          sx={{
            position: "fixed",
            top: "60px",
            left: `${drawerWidth - 30}px`,
            transition: "left 0.3s ease",
            zIndex: 1400,
          }}
        >
          <IconButton
            style={{ backgroundColor: "#14475a", color: "white" }}
            onClick={handleSidebarToggle}
          >
            {sidebarOpen ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </IconButton>
        </Box>
        <Box sx={{ marginTop: "60px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Admin_portal;
