import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import AccountCircle from "@mui/icons-material/AccountCircle";

import MoreIcon from "@mui/icons-material/MoreVert";
import dashboard from "../../assets/Dashboard.png";
import logout from "../../assets/logout2.png";
import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Button } from "@mui/material";

const drawerWidth = 190;
export default function DonorNavBar({ selectedMenuItem, sidebarOpen }) {
  const navigate = useNavigate();

  const location = useLocation();
  const backButton = location.pathname !== "/donor";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [unpaidProjectionCount, setUnpaidProjectionCount] = useState(0); // State for unpaid projection count
  const [paidProjectionCount, setPaidProjectionCount] = useState(0);
  const [duesProjectionCount, setDuesProjectionCount] = useState(0);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [Students, setStudents] = useState([]);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const user = localStorage.getItem("donor_name");

  useEffect(() => {
    // Fetch applications from the API
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched students data:", data);
        setStudents(data);

        // Calculate the total unpaid projections count
        const unpaidCount = data.reduce((count, student) => {
          const unpaidProjections = student.projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              (projection.sponsor_name1 === user ||
                projection.sponsor_name2 === user)
          );
          return count + unpaidProjections.length;
        }, 0);
        setUnpaidProjectionCount(unpaidCount);

        // Calculate the total paid projections count
        const paidCount = data.reduce((count, student) => {
          const paidProjections = student.projections.filter(
            (projection) =>
              projection.status === "Paid" &&
              (projection.sponsor_name1 === user ||
                projection.sponsor_name2 === user)
          );
          return count + paidProjections.length;
        }, 0);
        setPaidProjectionCount(paidCount);

        // Calculate the last unpaid projection that is due
        const duesCount = data.reduce((count, student) => {
          // Filter unpaid projections and check if the fee_due_date is in the past
          const duesProjections = student.projections
            .filter(
              (projection) =>
                projection.status === "Unpaid" &&
                new Date(projection.fee_due_date) < new Date() &&
                (projection.sponsor_name1 === user ||
                  projection.sponsor_name2 === user) // Check if the due date has passed
            )
            .sort(
              (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
            ); // Sort by fee_due_date, most recent first

          // If there are any dues, consider only the last one (most recent)
          if (duesProjections.length > 0) {
            count += 1; // Increment count for the last unpaid projection
          }

          return count;
        }, 0);

        setDuesProjectionCount(duesCount);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

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

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
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
    >
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
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
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <img src={logout} className="w-3 text-white"></img>
        </IconButton>
        <p>Logout</p>
      </MenuItem>
      <MenuItem>
        {/* <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon
              sx={{
                color: "#ff8a35",
              }}
            />
          </Badge>
        </IconButton>
        <p>Notifications</p> */}
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
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
          background: "#14475a",
          height: "50px",
          zIndex: 1201, // keep above drawer
          left: sidebarOpen ? `${drawerWidth}px` : 0,
          width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: "width 0.3s ease, left 0.3s ease",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "40px !important",
            px: 1,
          }}
        >
          {/* back button */}
          {backButton && (
            <Button
              sx={{
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "10px",
                paddingX: "8px",
                paddingY: "2px",
                textTransform: "capitalize",
                "&:hover": {
                  bgcolor: "#999", // or use a lighter gray like "#ccc" or "#e0e0e0"
                },
              }}
              onClick={() => navigate(-1)}
            >
              <IoArrowBackCircleOutline size={18} /> Back
            </Button>
          )}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <img src={dashboard} className="w-4 text-white"></img>
          </IconButton>
          <Typography
            variant="h7"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block", fontWeight: "semi-bold" },
            }}
            color="white"
          >
            Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={handleLogout}
            >
              <img
                src={logout}
                style={{
                  width: "14px",
                }}
                className=" text-white"
              ></img>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
