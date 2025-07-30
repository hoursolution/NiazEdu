import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import logo from "../../assets/NAIZ_LOGO.png";

import application from "../../assets/application.png";
import bank from "../../assets/bank.png";
import logout from "../../assets/logout2.png";
import { useNavigate } from "react-router-dom";
import "../../components/SideBar/Sidebarone.css";
import projectionsheet from "../../assets/projectionSheet.png";
export function StudentSideBar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [projections, setProjections] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [canAddAnotherApplication, setCanAddAnotherApplication] =
    useState(false);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  const handleLogout = () => {
    console.log("Logging out...");

    fetch(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Remove token and user from storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Redirect or perform other actions after successful logout
          navigate("/login");
        } else {
          console.error("Logout failed:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };
  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedStudentId = localStorage.getItem("studentId");
      if (!token || !storedStudentId) {
        console.error("Token not available or missing studentId.");
        return;
      }
      setStudentId(storedStudentId);
      const response = await fetch(
        `${BASE_URL}/api/studentDetails/${storedStudentId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching student details:", response.statusText);
        return;
      }

      const data = await response.json();
      setStudentDetails(data);
      setProjections(data.projections || []);
      // ✅ Check for last application's status
      const latestApp = data.applications?.[data.applications.length - 1];
      if (latestApp?.education_status === "Finished") {
        setCanAddAnotherApplication(true);
      } else {
        setCanAddAnotherApplication(false);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleBankDetailsClick = () => {
    setSelectedMenuItem("Bank Details");
    navigate("bankDetails");

    // Optionally, provide feedback to the user or perform a different action
  };
  const handleProjectionsheetClick = () => {
    setSelectedMenuItem("Documents");
    navigate("myprojection");
  };
  const handleAplicationClick = () => {
    setSelectedMenuItem("Your Application");
    navigate("/student");
  };
  const handleMenuItemClick = async (item) => {
    if (item.onClick) {
      await fetchStudentDetails();
      item.onClick();
    }
  };
  const sidebarBg = "#209be3"; // Mint to soft blueberry
  const hoverBg = "rgba(0, 0, 0, 0.20)";
  const activeBg = "rgba(0, 0, 0, 0.40)";
  const textColor = "white"; // Deep indigo for contrast

  const drawerPaperStyle = {
    background: sidebarBg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: textColor,
    borderRight: "none",
    boxShadow: "4px 0 6px rgba(0, 0, 0, 0.1)",
    width: 198,
    // border: `2px solid ${borderColor}`,
    overflowX: "hidden",
  };

  const menuItems = [
    // {
    //   text: "Dashboard",
    //   icon: <img src={dashboard} className="w-4 text-white"></img>,
    //   onClick: handleDashboardPortalClick,
    // },
    {
      text: "Your Application",
      icon: application,
      onClick: handleAplicationClick,
    },

    {
      text: "Documents",
      icon: projectionsheet,
      onClick: handleProjectionsheetClick,
      disabled: studentDetails && studentDetails.applications.length === 0,
    },
    {
      text: "Bank Details",
      icon: bank,
      onClick: handleBankDetailsClick,
      disabled: studentDetails && studentDetails.applications.length === 0,
    },

    // {
    //   text: "Logout",
    //   icon: logout,
    //   // onClick: handleLogout,
    // },
  ];

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      onClose={onClose}
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          ...drawerPaperStyle,
        },
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div
          className="flex justify-center py-3 bg-white mx-2 my-2 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={logo}
            alt="NAIZ Logo"
            className="h-24 object-contain cursor-pointer"
            onClick={() => navigate("/admin")}
          />
        </motion.div>

        {/* Menu Items */}
        <List className="flex-grow px-2">
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuItemClick(item)}
              sx={{
                borderRadius: "12px",
                mb: 1,
                px: 2.5,
                py: 0.7,
                backgroundColor:
                  selectedMenuItem === item.text ? activeBg : "transparent",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: hoverBg,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={item.icon}
                    alt={item.text}
                    className="w-4"
                    style={{
                      filter:
                        selectedMenuItem === item.text
                          ? "brightness(0) invert(1)"
                          : "none",
                      opacity: selectedMenuItem === item.text ? 1 : 0.8,
                    }}
                  />
                </motion.div>
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontSize: "12px",
                    fontWeight: "500",
                    color: textColor,
                    letterSpacing: "0.2px",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Logout */}
        <motion.div
          className="px-2 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Divider
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              marginBottom: "12px",
            }}
          />
          <ListItem
            button
            onClick={() => {
              console.log("Logging out...");
              navigate("/login");
            }}
            sx={{
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: hoverBg,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "36px" }}>
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <img src={logout} alt="logout" className="w-3" />
              </motion.div>
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                sx: {
                  fontSize: "14px",
                  fontWeight: "600",
                  color: textColor,
                },
              }}
            />
          </ListItem>
        </motion.div>
      </div>
    </Drawer>
  );
}
