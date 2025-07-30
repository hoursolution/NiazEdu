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
  const [studentData, setStudentData] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [projection, setProjections] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

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
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);
  return (
    <Box sx={{ width: "100%", maxHeight: "100%", px: { xs: 3, sm: 1 } }}>
      <StudentProjectionSheetTable studentId={studentId} />
    </Box>
  );
};

export default StudentProjectionSheet;
