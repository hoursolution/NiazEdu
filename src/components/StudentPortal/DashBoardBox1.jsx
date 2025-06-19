import { Box, Typography, Button, Avatar, Badge } from "@mui/material";
import React, { useEffect, useState } from "react";
import Profilepic from "../../assets/profile.jpg";
import { styled, alpha } from "@mui/material/styles";

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

const DashBoardBox1 = () => {
  const [studentDetails, setStudentDetails] = useState([]);
  const [projections, setProjections] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [studentId, setStudentId] = useState(""); // Declare studentId state
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedStudentId = localStorage.getItem("studentId");
        if (!token || !storedStudentId) {
          console.error("Token not available or missing studentId.");
          return;
        }

        setStudentId(storedStudentId); // Set studentId state

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
        setStudentDetails(data);
        setProjections(data.projections || []);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudentDetails();
  }, [studentId]);

  return (
    <Box
      sx={{
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        justifyContent: "space-between",
        height: "130px",
        width: "500px",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box sx={{ maxWidth: "15%", maxHeight: "5%" }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt="Profile pic"
              src={Profilepic}
              sx={{ width: 80, height: 100, margin: "15px 10px 0px 30px" }}
              variant="rounded"
            />
          </StyledBadge>
          {/* <img
            src={Profilepic}
            alt=""
            style={{
              objectFit: "cover",
              padding: "0px",
              margin: "10px 10px 0px 40px",
              borderRadius: "50%",
            }}
          /> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#304c49",
            }}
            style={{
              marginLeft: "65px",
              marginTop: "35px",
              maxHeight: "100%",
              fontWeight: "bold",
              fontFamily: "fantasy",
            }}
            variant="h7"
          >
            Welcome Back, {studentDetails.student_name}
          </Typography>
          <Typography
            sx={{
              color: "#304c49",
            }}
            style={{
              marginLeft: "35px",
              maxHeight: "100%",
              // fontWeight: "bold",
            }}
            variant="h7"
          >
            view Application
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoardBox1;
