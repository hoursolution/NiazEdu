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
} from "@mui/material";
import logo from "../../assets/ZEEN_LOGO.png";

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
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
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
  const menuItems = [
    // {
    //   text: "Dashboard",
    //   icon: <img src={dashboard} className="w-4 text-white"></img>,
    //   onClick: handleDashboardPortalClick,
    // },
    {
      text: "Your Application",
      icon: <img src={application} className="w-5 text-white"></img>,
      onClick: handleAplicationClick,
    },

    {
      text: "Documents",
      icon: <img src={projectionsheet} className="w-4 text-white"></img>,
      onClick: handleProjectionsheetClick,
      disabled: studentDetails && studentDetails.applications.length === 0,
    },
    {
      text: "Bank Details",
      icon: <img src={bank} className="w-5 text-blue-500"></img>,
      onClick: handleBankDetailsClick,
      disabled: studentDetails && studentDetails.applications.length === 0,
    },

    {
      text: "Logout",
      icon: <img src={logout} className="w-3 text-white"></img>,
      // onClick: handleLogout,
    },
  ];

  return (
    <div className="flex">
      <Drawer
        variant="persistent"
        open={isOpen}
        onClose={onClose}
        anchor="left"
        classes={{ paper: "custom-drawer-paper rounded-r-md" }}
        className="rounded-"
      >
        <div className="mt-5">
          <a href="#">
            <img src={logo} alt="Zeen" className="pl-2 h-24 w-44" />
          </a>
        </div>

        <List
          sx={{
            marginTop: "20px",
          }}
        >
          {menuItems.slice(0, -1).map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleMenuItemClick(item)}
              disabled={item.disabled}
              sx={{
                padding: "4px",
                paddingLeft: 2,
                paddingRight: 2.1,
                backgroundColor:
                  selectedMenuItem === item.text ? "#12b4bf" : "transparent", // Apply different background color to the selected menu item
              }}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                {React.cloneElement(item.icon, { color: "white" })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontSize: "13px",
                    paddingRight: "16px", // Adjust the font size
                    color: "white",
                    "&:hover": {
                      color: "#12b4bf",
                    }, // Change the text color
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Separate ListItem for the "Setting" item */}

        <ListItem
          button
          sx={{
            "&:hover": {
              // backgroundColor: "#ff8a35",
            },

            position: "absolute",
            bottom: 0,
          }}
        >
          <ListItemIcon
            sx={{
              marginBottom: "10px",
              marginLeft: 1.5,
            }}
            style={{ minWidth: "35px" }}
          >
            {React.cloneElement(menuItems[menuItems.length - 1].icon, {
              color: "white",
            })}
          </ListItemIcon>

          <ListItemText
            onClick={handleLogout}
            primary={menuItems[menuItems.length - 1].text}
            primaryTypographyProps={{
              sx: {
                fontSize: "13px",
                paddingRight: "16px",
                marginBottom: "5px", // Adjust the font size
                color: "white",
                "&:hover": {
                  color: "#12b4bf",
                }, // Change the text color // Change the text color
              },
            }}
          />
        </ListItem>
      </Drawer>
    </div>
  );
}
