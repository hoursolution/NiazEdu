import { Search } from "@mui/icons-material";
import {
  Box,
  Input,
  Paper,
  TextField,
  Typography,
  Badge,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import ProjectionSheetTable from "./ProjectionSheetTable";
import logo from "../../assets/zeenlogo.png";
import SingleProjectionSheetTable from "./SingleProjectionSheetTable";
import { useLocation } from "react-router-dom";
import Profilepic from "../../assets/profile.jpg";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
const SingleProjectionSheet = () => {
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "20px",
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "black",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(1)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "200px",
      },
    },
  }));

  const location = useLocation();
  const studentId = location.state?.studentId || "";

  // Use the student data in your component
  console.log("Student id:", studentId);

  // ... rest of the code
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Fetch student details using the studentId
    if (studentId) {
      // Make an API request to get student details by ID
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not available.");
        return;
      }
      // Replace the URL with your actual API endpoint
      fetch(`${BASE_URL}/api/studentDetails/${studentId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the retrieved data
          console.log("Student details:", data);
          setStudentData(data); // Update the state with student details
        })
        .catch((error) => {
          console.error("Error fetching student details:", error);
        });
    }
  }, [studentId]);
  return (
    <div className=" h-screen">
      <div>
        <Paper
          sx={{
            marginTop: 2,
            width: "99%",
            borderRadius: "20px",
          }}
          elevation={6}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap", // Allow items to wrap on smaller screens
              alignItems: "center",
              background:
                "linear-gradient(0deg, rgba(31,184,195,0) 0%, rgba(57,104,120,0.6112570028011204) 100%)",
              borderRadius: "20px",
              padding: "20px",
              gap: 2, // Adds spacing between items
            }}
          >
            {/* Avatar Section */}
            <Box
              sx={{
                flex: { xs: "100%", sm: 0.5 },
                minWidth: 100,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt="Profile pic"
                  src={studentData?.applications?.[0].profile_picture}
                  sx={{ width: 56, height: 56 }}
                />
              </StyledBadge>
            </Box>

            {/* Name and Program Section */}
            <Box sx={{ flex: { xs: "100%", sm: 1.5 }, minWidth: 200 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", wordBreak: "break-word" }}
              >
                {studentData?.applications?.[0].name
                  ? studentData.applications[0].name.toUpperCase()
                  : ""}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "10px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {studentData?.applications?.[0].program_interested_in?.toUpperCase()}{" "}
                | STUDENT ID {studentData?.applications?.[0].id}
              </Typography>
            </Box>

            {/* Gender, DOB, Address */}
            <Box sx={{ flex: { xs: "100%", sm: 2 }, minWidth: 200 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                GENDER: {studentData?.applications?.[0].gender.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                DOB: {studentData?.applications?.[0].date_of_birth}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                ADDRESS: {studentData?.applications?.[0].address.toUpperCase()}
              </Typography>
            </Box>

            {/* Place of Birth, Residency, Institute */}
            <Box sx={{ flex: { xs: "100%", sm: 2 }, minWidth: 200 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                PLACE OF BIRTH:{" "}
                {studentData?.applications?.[0].village.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                PLACE OF RESIDENCY:{" "}
                {studentData?.applications?.[0].country.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                INSTITUTE:{" "}
                {studentData?.applications?.[0].institution_interested_in.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </div>

      <SingleProjectionSheetTable studentId={studentId} />
    </div>
  );
};

export default SingleProjectionSheet;
