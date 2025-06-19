import {
  Box,
  Paper,
  Typography,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const StudentApplicationDetailsForDonor = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [projections, setProjections] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // const [studentId, setStudentId] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
  };

  const columnStyle = {
    padding: 1.4,
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
    flex: 1,
  };

  const headerStyle = {
    padding: 1,
    backgroundColor: "#0369a3",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 2,
    boxShadow: "0px 2px 4px #011720",
  };

  const location = useLocation();
  const { studentId, applicationId } = location.state || {};

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
      fetch(
        `${BASE_URL}/api/studentDetails/${studentId}/application/${applicationId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle the retrieved data
          console.log("Student details:", data);
          setStudentDetails(data); // Update the state with student details
        })
        .catch((error) => {
          console.error("Error fetching student details:", error);
        });
    }
  }, [studentId]);

  return (
    <div className="h-screen">
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          width: "99%",
          position: "fixed",
        }}
      >
        <Tab
          label="Informations"
          sx={{
            // backgroundColor: "#ff8a35",
            fontWeight: "bold",
            backgroundColor: activeTab === 0 ? "#DCD7D7" : "#14475a",
            borderTopLeftRadius: "5px",
            color: "white",
            flex: 1,
          }}
        />
        <Tab
          label="Statements"
          sx={{
            // backgroundColor: "#ff8a35",
            fontWeight: "bold",
            backgroundColor: activeTab === 1 ? "#DCD7D7" : "#14475a",

            color: "white",
            flex: 1,
          }}
        />
        <Tab
          label="Documents"
          sx={{
            // backgroundColor: "#ff8a35",
            fontWeight: "bold",
            backgroundColor: activeTab === 2 ? "#DCD7D7" : "#14475a",
            color: "white",
            flex: 1,
          }}
        />
      </Tabs>
      {activeTab === 0 && (
        <Paper
          sx={{
            marginTop: 2,
            padding: 3,
            paddingTop: 10,
            borderRadius: 3,
            width: "100%",
          }}
        >
          <Box>
            {/* Header */}
            <Box sx={headerStyle}>
              <Typography variant="h6">Personal Information</Typography>
            </Box>

            {/* Name and Status Row */}
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Name:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.student_name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Status:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.status}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Father Name:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.father_name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Date of Birth:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.date_of_birth}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Age:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.age}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Gender:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.gender}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Contact Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography variant="h6">Contact Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Mobile No:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.mobile_no}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    CNIC / B-FORM:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.cnic_or_b_form}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Email:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Country:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.country}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Province:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.province}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    City:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.city}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Address */}
            <Box
              sx={{ ...columnStyle, backgroundColor: "#f5f0f0", marginTop: 3 }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                Address:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {studentDetails?.application?.address}
              </Typography>
            </Box>

            {/* Educational Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography variant="h6">Educational Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 0.2 }}>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Current Level:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.current_level_of_education}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Program Interested In:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.program_interested_in}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Institution Interested In:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.institution_interested_in}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    No Of Years:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.no_of_years}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    No Of Semesters:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.no_of_semesters}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    No Of Semesters:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.program_addmision_date}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    No Of Semesters:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.classes_commencement_date}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/*  Financial Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography variant="h6"> Financial Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Addmission Fee Of Program:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.admission_fee_of_the_program}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Total Fee Of Program:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.total_fee_of_the_program}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Living Expenses / Year:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.living_expenses}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Food And Necessities Expenses / Year:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.food_and_necessities_expenses}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Transport Amount / Year:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.transport_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Other Cost / Year:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.other_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Expected Sponsorship Amount:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.expected_sponsorship_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Addmission Fees Considered:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.admission_fee_considered}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Addmission Fees Persentage Approved :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {
                      studentDetails?.application
                        ?.admission_fee_persentage_considered
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Education Fees considered:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.education_fee_considered}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Education Fees Persentage Approved:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {
                      studentDetails?.application
                        ?.education_fee_persentage_considered
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Other Cost Approved :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application?.other_cost_considered}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    {" "}
                    Other Cost Persentage Consider :
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {
                      studentDetails?.application
                        ?.other_cost_persentage_considered
                    }
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      {activeTab === 1 && (
        <Paper
          sx={{
            marginTop: 2,
            padding: 3,
            paddingTop: 6,
            borderRadius: 3,
            width: "100%",
          }}
        >
          <Box sx={{ borderRadius: 9 }}>
            {/* personal information tab */}
            <Box sx={headerStyle} mt={3}>
              <Typography variant="h6" sx={{ color: "white" }}>
                Household Information
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Total Members Of HouseHold:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application.total_members_of_household}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Expense / Month:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application.expense_per_month}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    Total Amount:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {studentDetails?.application.total_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle1"
                  >
                    Info Of HouseHold:
                  </Typography>
                  <Typography variant="subtitle2">
                    {studentDetails?.application.description_of_household}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={headerStyle} mt={3}>
              <Typography variant="h6" sx={{ color: "white" }}>
                Statement
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} md={12}>
                <Box sx={columnStyle}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                    variant="subtitle1"
                  >
                    Personal Statement:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textAlign: "left" }}>
                    {studentDetails?.application.personal_statement}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      {activeTab === 2 && (
        <Paper
          sx={{
            marginTop: 2,
            width: "99%",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#148581",
                textTransform: "uppercase",
              }}
            >
              Documents
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Degree Documents Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ ...columnStyle }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Degree Documents:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {studentDetails?.application?.degree_documents?.map(
                      (document, index) => (
                        <Button
                          key={index}
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleViewFileDetails(document)}
                          sx={{ textTransform: "none" }}
                        >
                          <a
                            href={`https://res.cloudinary.com/ddkoi7tix/${document.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            View Degree {index + 1}
                          </a>
                        </Button>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Transcript Documents Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ ...columnStyle }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Transcript Documents:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {studentDetails?.application?.transcript_documents?.map(
                      (document, index) => (
                        <Button
                          key={index}
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleViewFileDetails(document)}
                          sx={{ textTransform: "none" }}
                        >
                          <a
                            href={`https://res.cloudinary.com/ddkoi7tix/${document.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            View Transcript {index + 1}
                          </a>
                        </Button>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Income Statement Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ ...columnStyle }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Income Statement Documents:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {studentDetails?.application?.income_statement_documents?.map(
                      (document, index) => (
                        <Button
                          key={index}
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleViewFileDetails(document)}
                          sx={{ textTransform: "none" }}
                        >
                          <a
                            href={`https://res.cloudinary.com/ddkoi7tix/${document.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            View Statement {index + 1}
                          </a>
                        </Button>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Picture Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ ...columnStyle }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Profile Picture:
                  </Typography>
                  <Box sx={{ textAlign: "center" }}>
                    <img
                      src={studentDetails?.application?.profile_picture}
                      alt="Profile"
                      style={{ maxWidth: "100px", borderRadius: "8px" }}
                    />
                    <Typography>
                      <a
                        href={studentDetails?.application?.profile_picture}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "#148581" }}
                      >
                        View Profile
                      </a>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Degrees Table */}
          <Box sx={{ marginTop: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#148581",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              Student Degrees
            </Typography>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell align="center">Degree Name</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Institute Name</TableCell>
                    <TableCell align="center">Grade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentDetails?.application?.degree ? (
                    studentDetails.application.degree.map((degree) => (
                      <TableRow
                        key={degree.id}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        }}
                      >
                        <TableCell align="center">
                          {degree.degree_name}
                        </TableCell>
                        <TableCell align="center">{degree.status}</TableCell>
                        <TableCell align="center">
                          {degree.institute_name}
                        </TableCell>
                        <TableCell align="center">{degree.grade}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No degree information available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default StudentApplicationDetailsForDonor;
