import { Search } from "@mui/icons-material";
import {
  Box,
  Input,
  Paper,
  TextField,
  Typography,
  Avatar,
  Badge,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import logo from "../../assets/zeenlogo.png";
import StudentProjectionSheetTable from "./StudentProjectionSheetTable";
import { useLocation } from "react-router-dom";
import Profilepic from "../../assets/profile.jpg";
import { useNavigate } from "react-router-dom";

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
const StudentProjectionSheet = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  // const Search = styled("div")(({ theme }) => ({
  //   position: "relative",
  //   borderRadius: "20px",
  //   backgroundColor: alpha(theme.palette.common.white, 0.8),
  //   "&:hover": {
  //     backgroundColor: alpha(theme.palette.common.white, 15),
  //   },
  //   marginRight: theme.spacing(2),
  //   marginLeft: 0,
  //   width: "100%",
  //   [theme.breakpoints.up("sm")]: {
  //     marginLeft: theme.spacing(3),
  //     width: "auto",
  //   },
  // }));
  // const SearchIconWrapper = styled("div")(({ theme }) => ({
  //   padding: theme.spacing(0, 2),
  //   height: "100%",
  //   position: "absolute",
  //   pointerEvents: "none",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  // }));
  // const StyledInputBase = styled(InputBase)(({ theme }) => ({
  //   color: "black",
  //   "& .MuiInputBase-input": {
  //     padding: theme.spacing(1, 1, 1, 0),
  //     // vertical padding + font size from searchIcon
  //     paddingLeft: `calc(1em + ${theme.spacing(1)})`,
  //     transition: theme.transitions.create("width"),
  //     width: "100%",
  //     [theme.breakpoints.up("md")]: {
  //       width: "200px",
  //     },
  //   },
  // }));

  // ... rest of the code
  const [studentData, setStudentData] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [projection, setProjections] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  useEffect(() => {
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
        console.log("Student details:", data);
        setStudentData(data);
        setProjections(data.projections || []);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);
  return (
    <div className=" h-screen">
      {/* <div>
        <Paper
          sx={{
            marginTop: 2,
            height: 80,
            width: "99%",
            borderRadius: "20px",
          }}
          elevation={6}
        >
          <Box
            sx={{
              marginTop: "0px",
              height: 80,
              display: "flex",
              alignItems: "center",
              background:
                "linear-gradient(0deg, rgba(31,184,195,0) 0%, rgba(57,104,120,0.6112570028011204) 100%)",
              borderRadius: "20px",
              padding: "30px", // Added padding for spacing
            }}
          >
            <Box sx={{ flex: 0.7 }}>
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
            <Box sx={{ flex: 2, marginLeft: "1px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {studentData?.applications?.[0].name
                  ? studentData.applications[0].name.toUpperCase()
                  : ""}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "8px" }}>
                {studentData?.applications?.[0].current_level_of_education.toUpperCase()}{" "}
                | STUDENT ID {studentData?.applications?.[0].id}
              </Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "12px" }}
              >
                GENDER: {studentData?.applications?.[0].gender.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "12px" }}
              >
                DOB: {studentData?.applications?.[0].date_of_birth}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "12px" }}
              >
                ADDRESS: {studentData?.applications?.[0].address.toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "12px" }}
              >
                PLACE OF BIRTH:{" "}
                {studentData?.applications?.[0].village.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "12px" }}
              >
                PLACE OF RESIDENCY:{" "}
                {studentData?.applications?.[0].country.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "12px" }}
              >
                INSTITUTE:{" "}
                {studentData?.applications?.[0].institution_interested_in.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </div> */}

      <StudentProjectionSheetTable studentId={studentId} />
    </div>
  );
};

export default StudentProjectionSheet;
