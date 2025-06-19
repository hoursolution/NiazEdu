import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import images
import varification_logo from "../../assets/varification.png";
import application_logo from "../../assets/applications.png";
import interview_logo from "../../assets/interviews.png";
import adminprojectionsheet_logo from "../../assets/adminprojectionsheets.png";
import programs_logo from "../../assets/programs.png";
import student_logo from "../../assets/student.png";
import selectmentor_logo from "../../assets/selectmentor.png";
import report_logo from "../../assets/reportlogo.jpg";
import selectdonor_logo from "../../assets/selectDonor.png";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dashboard items
  const dashboardItems = [
    { logo: application_logo, onClick: () => navigate("allApplications") },
    { logo: varification_logo, onClick: () => navigate("allVarification") },
    { logo: interview_logo, onClick: () => navigate("allInterviews") },
    { logo: selectdonor_logo, onClick: () => navigate("selectDonor") },
    { logo: selectmentor_logo, onClick: () => navigate("selectMentor") },
    { logo: programs_logo, onClick: () => navigate("programs") },
    {
      logo: adminprojectionsheet_logo,
      onClick: () => navigate("ProjectionDashBoard1"),
    },
    { logo: student_logo, onClick: () => navigate("Students") },
    // { logo: report_logo, onClick: () => navigate("/Admin/Reports") },
  ];

  return (
    <Box sx={{ paddingX: 5, paddingTop: 8 }}>
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
        {/* Last Item (Report) with Label */}
        {/* <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                color: "#333",
              }}
            >
              Report
            </Typography>
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
