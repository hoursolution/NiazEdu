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

    const tokenExpirationTime = 365 * 24 * 60 * 60 * 1000; // 1 year
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
          overflow: "hidden", // prevent horizontal scroll
          width: `calc(100vw - ${drawerWidth}px)`, // explicitly limit width
          position: "relative",
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

export default Admin_portal;
