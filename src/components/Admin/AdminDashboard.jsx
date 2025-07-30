import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion for animations

// Import images
import varification_logo from "../../assets/verifications.jpg";
import application_logo from "../../assets/applicationss.jpg";
import interview_logo from "../../assets/interviews.jpg";
import adminprojectionsheet_logo from "../../assets/adminprojectionsheetss.jpg";
import programs_logo from "../../assets/programs.png";
import student_logo from "../../assets/students.jpg";
import selectmentor_logo from "../../assets/selectmentors.jpg";
import report_logo from "../../assets/reportlogos.jpg";
import selectdonor_logo from "../../assets/selectDonors.jpg";
import { FaArrowRightToBracket } from "react-icons/fa6";

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dashboard items
  const dashboardItems = [
    { logo: application_logo, onClick: () => navigate("allApplications") },
    { logo: varification_logo, onClick: () => navigate("allVarification") },
    { logo: interview_logo, onClick: () => navigate("allInterviews") },
    { logo: selectdonor_logo, onClick: () => navigate("selectDonor") },
    { logo: selectmentor_logo, onClick: () => navigate("selectMentor") },
    {
      logo: adminprojectionsheet_logo,
      onClick: () => navigate("ProjectionDashBoard1"),
    },
    { logo: student_logo, onClick: () => navigate("Students") },
    { logo: report_logo, onClick: () => navigate("/Admin/Reports") },
  ];

  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: "rgba(255, 255, 255, 0.65)",
        minHeight: "100vh",
      }}
    >
      <Box>
        {/* Heading */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#000",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* Button (aligned left) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: accentColor,
              color: "white",
              textTransform: "capitalize",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "#1C3070",
              },
            }}
            onClick={() => navigate("donors")}
            startIcon={<FaArrowRightToBracket size={16} />}
          >
            Donors List
          </Button>
        </Box>
      </Box>

      {/* cards */}
      <Grid container rowSpacing={6} columnSpacing={3} justifyContent="center">
        {dashboardItems.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Box
              component="img"
              src={item.logo}
              alt="Dashboard Icon"
              onClick={item.onClick}
              sx={{
                width: "100%",
                maxWidth: "280px",
                height: "160px",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
                borderRadius: "16px",
                border: "1px solid #aaa",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Last Item (Report) with Label */}
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            onClick={() => navigate("/Admin/Reports")}
            sx={{
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={report_logo}
              alt="Report"
              sx={{
                width: "100%",
                maxWidth: "190px",
                height: "auto",
                transition: "transform 0.3s ease-in-out",
                borderRadius: "10px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                marginTop: "8px",
                fontWeight: "bold",
                color: "#e5e7eb",
              }}
            >
              Report
            </Typography>
          </Box>
        </motion.div>
      </Grid> */}
    </Box>
  );
};

export default AdminDashboard;
