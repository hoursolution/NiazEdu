import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import logo from "../../assets/ZEEN_LOGO.png";
import dashboard from "../../assets/Dashboard.png";
import application from "../../assets/application.png";
import mentor from "../../assets/mentor.png";
import projectionsheet from "../../assets/projectionSheet.png";
import program from "../../assets/program.png";
import student from "../../assets/students.png";
import Report from "../../assets/reportss.png";
import donor from "../../assets/donor.png";
import verification from "../../assets/Verificatiion.png";
import interview from "../../assets/interview.png";
import logout from "../../assets/logout2.png";
import { useNavigate } from "react-router-dom";
import "../../components/SideBar/Sidebarone.css";

export function SidebarOne({ isOpen, onClose, handleMenuItemClick }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  const [selectedMenuItem, setSelectedMenuItem] = useState(""); // State to store the currently selected menu item

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

  const handleDashboardPortalClick = () => {
    navigate("/admin");
  };
  const handleApplicationClick = () => {
    navigate("allApplications");
  };
  const handleVarificationClick = () => {
    navigate("allVarification");
  };
  const handleInterviewsClick = () => {
    navigate("allInterviews");
  };
  const handleSelectDonorClick = () => {
    navigate("selectDonor");
  };
  const handleSelectMentorClick = () => {
    navigate("selectMentor");
  };
  const handleProgramsClick = () => {
    navigate("programs");
  };
  const handleProjectionClick = () => {
    navigate("ProjectionDashBoard");
  };
  const handleReportsClick = () => {
    navigate("Reports");
  };
  const handleStudentClick = () => {
    navigate("Students");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <img src={dashboard} className="w-4 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("DASHBOARD");
        setSelectedMenuItem("Dashboard");
        navigate("/admin");
      },
    },
    {
      text: "Application",
      icon: <img src={application} className="w-4 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("APPLICATION");
        setSelectedMenuItem("Application");
        console.log(selectedMenuItem);
        navigate("allApplications");
      },
    },
    {
      text: "Verification",
      icon: <img src={verification} className="w-4 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("VERIFICATION");
        setSelectedMenuItem("Verification");
        navigate("allVarification");
      },
    },
    {
      text: "Interviews",
      icon: <img src={interview} className="w-5 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("INTERVIEW");
        setSelectedMenuItem("Interviews");
        navigate("allInterviews");
      },
    },
    {
      text: "Select Donor",
      icon: <img src={donor} className="w-5 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("SELECT DONOR");
        setSelectedMenuItem("Select Donor");
        navigate("selectDonor");
      },
    },
    {
      text: "Select Mentor",
      icon: <img src={mentor} className="w-5 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("SELECT MENTOR");
        setSelectedMenuItem("Select Mentor");
        navigate("selectMentor");
      },
    },
    {
      text: "Projection Sheets",
      icon: <img src={projectionsheet} className="w-4 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("PROJECTION SHEETS");
        setSelectedMenuItem("Projection Sheets");
        navigate("ProjectionDashBoard1");
        // navigate("ProjectionDashBoard");
      },
    },
    // {
    //   text: "Add Programs",
    //   icon: <img src={program} className="w-5 text-white"></img>,
    //   onClick: () => {
    //     handleMenuItemClick("PROGRAMS");
    //     setSelectedMenuItem("Add Programs");
    //     navigate("programs");
    //   },
    // },
    {
      text: "Reports",
      icon: <img src={Report} className="w-5 text-white ml-[-2px]"></img>,
      onClick: () => {
        handleMenuItemClick("REPORTS");
        setSelectedMenuItem("Reports");
        navigate("Reports");
      },
    },

    {
      text: "Students",
      icon: <img src={student} className="w-5 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("STUDENTS");
        setSelectedMenuItem("Students");
        navigate("Students");
      },
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
        sx={{
          "& .MuiDrawer-paper": {
            width: isOpen ? 200 : 0,
            maxHeight: "100vh",
            overflowY: "auto",
            backgroundColor: "#1e1e2f",
            color: "white",
          },
        }}
        classes={{ paper: "custom-drawer-paper rounded-r-md " }}
      >
        <div className="mt-5">
          <a href="#">
            <img src={logo} alt="saudit" className="pl-3 h-24 w-44" />
          </a>
        </div>

        <List
          sx={{
            marginTop: "20px",
          }}
        >
          {menuItems.slice(0, -2).map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={item.onClick}
              sx={{
                padding: "2px",
                paddingLeft: 3,
                paddingRight: 2.1,
                backgroundColor:
                  selectedMenuItem === item.text ? "#12b4bf" : "transparent", // Apply background color for selected item
              }}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                {React.cloneElement(item.icon, {
                  color: "white",
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontSize: "13px",
                    paddingRight: "16px", // Adjust the font size
                    color: "white",
                    "&:hover": {
                      color: "#12b4bf", // Change the text color on hover
                    },
                  },
                }}
              />
            </ListItem>
          ))}

          {/* Divider for separation */}
          <Divider
            sx={{
              backgroundColor: "white", // Line color
              marginY: 1,
              marginTop: 4, // Spacing around the divider
            }}
          />

          {/* New Section Above Logout */}
          {menuItems.slice(-2, -1).map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={item.onClick}
              sx={{
                padding: "2px",
                paddingLeft: 3,
                paddingRight: 2.1,
                backgroundColor:
                  selectedMenuItem === item.text ? "#12b4bf" : "transparent", // Background color for selected item
              }}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                {React.cloneElement(item.icon, {
                  color: "white",
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontSize: "13px",
                    paddingRight: "16px", // Adjust the font size
                    color: "white",
                    "&:hover": {
                      color: "#12b4bf", // Change the text color on hover
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Separate ListItem for Logout */}
        <Divider
          sx={{
            backgroundColor: "white", // Line color
          }}
        />
        <ListItem
          button
          sx={{
            position: "absolute", // Position logout at the bottom
            bottom: 0,
            width: "100%", // Full width
          }}
        >
          <Divider
            sx={{
              backgroundColor: "white", // Line color
              marginY: 2, // Spacing around the divider
            }}
          />
          <ListItemIcon
            sx={{
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
                marginBottom: "10px", // Adjust the font size
                color: "white",
                "&:hover": {
                  color: "#12b4bf", // Change text color on hover
                },
              },
            }}
          />
        </ListItem>
      </Drawer>
    </div>
  );
}
