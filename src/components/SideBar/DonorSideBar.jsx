import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import logo from "../../assets/ZEEN_LOGO.png";
import dashboard from "../../assets/Dashboard.png";
import logout from "../../assets/logout2.png";
import { useNavigate } from "react-router-dom";
import "../../components/SideBar/Sidebarone.css";

export function SidebarOne({ isOpen, onClose, handleMenuItemClick }) {
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";
  // const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [anchorEl, setAnchorEl] = useState(null);

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

  const menuItems = [
    {
      text: "Your Students",
      icon: <img src={dashboard} className="w-4 text-white"></img>,
      onClick: () => {
        handleMenuItemClick("YOUR STUDENTS");
        navigate("/donor");
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
        classes={{ paper: "custom-drawer-paper rounded-r-1xl  " }}
        className="rounded-"
      >
        <div className="mt-1 p-2">
          <a href="#">
            <img src={logo} alt="saudit" className=" h-24 w-full" />
          </a>
        </div>

        <List
          sx={{
            marginTop: "40px",
          }}
        >
          {menuItems.slice(0, -1).map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={item.onClick}
              sx={{
                padding: "2px",
                paddingLeft: 3,
                paddingRight: 4,
                "&:hover": {
                  backgroundColor: "#14565a",
                },
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
                    // "&:hover": {
                    //   color: "#12b4bf",
                    // },
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
              backgroundColor: "#14565a",
            },
            position: "absolute",
            bottom: 0,
            padding: "2px",
            paddingLeft: 3,
            paddingRight: 4,
          }}
        >
          <ListItemIcon
            sx={{
              marginBottom: "10px",
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
                // "&:hover": {
                //   color: "#12b4bf",
                // }, // Change the text color // Change the text color
              },
            }}
          />
        </ListItem>
      </Drawer>
    </div>
  );
}
