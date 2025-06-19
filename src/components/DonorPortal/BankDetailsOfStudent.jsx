import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Modal,
  Badge,
  Avatar,
  Grid,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import Profilepic from "../../assets/profile.jpg";
import { useLocation } from "react-router-dom";

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

const BankDetailsOfStudent = () => {
  const { studentId } = useParams(); // Extract studentId from route parameters
  const [studentData, setStudentData] = useState(null);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // Other state variables and functions as needed
  const location = useLocation();
  const { applicationId } = location.state || {};

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not available");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/api/studentDetails/${studentId}/application/${applicationId}/`,
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
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  // Other functions and JSX code as needed

  return (
    <div>
      <div>
        <Paper
          sx={{
            marginTop: 0,
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
              padding: "10px",
              gap: 1, // Adds spacing between items
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
                  src={studentData?.application?.profile_picture}
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
                {studentData?.application?.name
                  ? studentData.application?.name.toUpperCase()
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
                {studentData?.application?.program_interested_in?.toUpperCase()}{" "}
                | STUDENT ID {studentData?.application?.id}
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
                GENDER: {studentData?.application?.gender.toUpperCase()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                DOB: {studentData?.application?.date_of_birth}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                ADDRESS: {studentData?.application?.address.toUpperCase()}
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
                {studentData?.application?.village.toUpperCase()}
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
                {studentData?.application?.country.toUpperCase()}
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
                {studentData?.application?.institution_interested_in.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </div>
      <Paper
        elevation={4}
        sx={{
          width: "99%",
          minHeight: "350px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(18,180,191,0.08)",
          bgcolor: "#f7fafc",
          p: { xs: 1, sm: 2, md: 4 },
          mt: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #12b4bf 0%, #14475A 100%)",
            py: { xs: 2, md: 1 },
            px: { xs: 2, md: 4 },
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(18,180,191,0.08)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            BANKING DETAILS
          </Typography>
        </Box>

        {/* Details */}
        <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 6 } }}>
          <Box
            // key={idx}
            sx={{
              mb: 4,
              background: "#fff",
              borderRadius: 2,
              p: { xs: 2, md: 4 },
              border: "1px solid #e0e7ef",
              maxWidth: { xs: "100%", md: "900px" },
              mx: "auto",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#14475A", fontWeight: 600 }}
                >
                  Account Title
                </Typography>
                <Typography variant="body2" sx={{ color: "#333" }}>
                  {studentData?.bank_details.account_title || ""}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#14475A", fontWeight: 600 }}
                >
                  IBAN Number
                </Typography>
                <Typography variant="body2" sx={{ color: "#333" }}>
                  {studentData?.bank_details.IBAN_number || ""}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#14475A", fontWeight: 600 }}
                >
                  Bank Name
                </Typography>
                <Typography variant="body2" sx={{ color: "#333" }}>
                  {studentData?.bank_details.bank_name || ""}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#14475A", fontWeight: 600 }}
                >
                  Branch Address
                </Typography>
                <Typography variant="body2" sx={{ color: "#333" }}>
                  {studentData?.bank_details.branch_address || ""}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#14475A", fontWeight: 600 }}
                >
                  City
                </Typography>
                <Typography variant="body2" sx={{ color: "#333" }}>
                  {studentData?.bank_details.city || ""}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {/* Divider for clarity if multiple details */}
          {/* {studentData?.bankdetails.length > 1 && <Divider sx={{ my: 2 }} />} */}
          {/* Add/Edit Button */}
        </Box>
      </Paper>
    </div>
  );
};

export default BankDetailsOfStudent;
