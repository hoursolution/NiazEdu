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
import AllProjectionSheetTable from "./AllProjectionSheetTable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Profilepic from "../../../assets/profile.jpg";
import AddProjectionForm from "./AddProjection";

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
const AllProjectionsOfStudent = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const studentId = location.state?.studentId || "";

  // Define state variables
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [projections, setProjections] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false); // Step 1: Define state variable
  const BASE_URL = "http://127.0.0.1:8000";
  // const BASE_URL = "https://zeenbackend-production.up.railway.app";
  useEffect(() => {
    // Step 2: Fetch projections based on refreshFlag
    if (refreshFlag) {
      // Fetch projections logic here
      setRefreshFlag(false); // Reset flag after fetching projections
    }
  }, [refreshFlag]); // Step 2: Add refreshFlag as a dependency

  const refreshProjections = () => {
    // Step 3: Set refreshFlag to true to trigger re-render of AllProjectionSheetTable
    setRefreshFlag(true);
  };

  // Fetch student details using studentId
  useEffect(() => {
    if (studentId) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not available.");
        return;
      }
      fetch(`${BASE_URL}/api/studentDetails/${studentId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Student details:", data);
          setStudentData(data);
          setProjections(data.projections || []); // Set projections from student data
        })
        .catch((error) => {
          console.error("Error fetching student details:", error);
        });
    }
  }, [studentId]);

  return (
    <div className="h-screen">
      <div>
        <Paper
          sx={{
            marginTop: 1,
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
      </div>

      <AllProjectionSheetTable
        studentId={studentId}
        refreshFlag={refreshFlag}
      />
      <AddProjectionForm
        studentId={studentId}
        refreshProjections={refreshProjections}
      />
    </div>
  );
};

export default AllProjectionsOfStudent;
