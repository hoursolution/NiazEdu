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
import { useNavigate } from "react-router-dom"; // Import useHistory

const StudentApplicationDetails = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [projections, setProjections] = useState([]);
  const [studentId, setStudentId] = useState("");
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate(); // Initialize useHistory
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleBack = () => {
    setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
  };
  const handleViewFileDetails = (file) => {
    // Create a URL for the selected file
    const fileURL = URL.createObjectURL(file);

    // Open a new window/tab to display the file
    window.open(fileURL);
  };
  const columnStyle = {
    padding: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
    flex: 1,
  };

  const headerStyle = {
    padding: 1,
    backgroundColor: "#12b4bf",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 2,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
  };
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
      setStudentDetails(data);
      console.log(studentDetails);
      setProjections(data.projections || []);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);
  console.log(studentDetails);
  useEffect(() => {
    if (studentDetails && studentDetails.applications.length === 0) {
      navigate("/student/addapplication"); // Redirect to addApplicationForm route
    }
  }, [studentDetails, navigate]);

  return (
    <div className="h-screen">
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          marginTop: 1,
          width: "99%",
        }}
      >
        <Tab
          label="Informations"
          sx={{
            // backgroundColor: "#ff8a35",
            fontWeight: "bold",
            backgroundColor: activeTab === 0 ? "#DCD7D7" : "#436850",
            borderTopLeftRadius: "5px",
            // color: "white",
            flex: 1,
          }}
        />
        <Tab
          label="Statements"
          sx={{
            // backgroundColor: "#ff8a35",
            fontWeight: "bold",
            backgroundColor: activeTab === 1 ? "#DCD7D7" : "#436850",

            // color: "white",
            flex: 1,
          }}
        />
        <Tab
          label="Documents"
          sx={{
            // backgroundColor: "#ff8a35",
            fontWeight: "bold",
            backgroundColor: activeTab === 2 ? "#DCD7D7" : "#436850",
            // color: "white",
            flex: 1,
          }}
        />
      </Tabs>
      {activeTab === 0 && (
        <Paper
          sx={{ marginTop: 0.2, padding: 1, borderRadius: 3, width: "100%" }}
        >
          <Box>
            {/* Header */}
            <Box sx={headerStyle}>
              <Typography variant="h6">Student Details</Typography>
            </Box>

            {/* Name and Status Row */}
            <Grid container spacing={2} sx={{ marginTop: 0.2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle1">Name</Typography>
                  <Typography>{studentDetails?.student_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle1">Status</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.status}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Personal Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography>Personal Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Father Name</Typography>
                  <Typography>{studentDetails?.father_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Last Name</Typography>
                  <Typography>{studentDetails?.last_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.date_of_birth}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Age</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.age}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Gender</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.gender}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Contact Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography>Contact Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 0.2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Mobile No</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.mobile_no}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">CNIC / B-FORM</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.cnic_or_b_form}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Country</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.country}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Province</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.province}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">City</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.city}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Address */}
            <Box
              sx={{ ...columnStyle, backgroundColor: "#f5f0f0", marginTop: 3 }}
            >
              <Typography>Address</Typography>
              <Typography>
                {studentDetails?.applications[0]?.address}
              </Typography>
            </Box>

            {/* Educational Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography>Educational Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 0.2 }}>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Current Level</Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
                        ?.current_level_of_education
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    Program Interested In
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.program_interested_in}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    Institution Interested In
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.institution_interested_in}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">No Of Years</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.no_of_years}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">No Of Semesters</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.no_of_semesters}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">No Of Semesters</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.program_addmision_date}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">No Of Semesters</Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.classes_commencement_date}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/*  Financial Information */}
            <Box sx={headerStyle} mt={3}>
              <Typography> Financial Information</Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    Addmission Fee Of Program
                  </Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
                        ?.admission_fee_of_the_program
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Total Fee Of Program
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.total_fee_of_the_program}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Living Expenses / Year
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.living_expenses}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Food And Necessities Expenses / Year
                  </Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
                        ?.food_and_necessities_expenses
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Transport Amount / Year
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.transport_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Other Cost / Year
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.other_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Expected Sponsorship Amount
                  </Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
                        ?.expected_sponsorship_amount
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Addmission Fees Considered
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.admission_fee_considered}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Addmission Fees Persentage Approved{" "}
                  </Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
                        ?.admission_fee_persentage_considered
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Education Fees considered
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.education_fee_considered}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Education Fees Persentage Approved
                  </Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
                        ?.education_fee_persentage_considered
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    Other Cost Approved{" "}
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0]?.other_cost_considered}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    {" "}
                    Other Cost Persentage Consider{" "}
                  </Typography>
                  <Typography>
                    {
                      studentDetails?.applications[0]
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
        <Paper sx={{ marginTop: 0.2, width: "99%" }}>
          <Box sx={{ borderRadius: 9 }}>
            {/* personal information tab */}
            <Box sx={headerStyle} mt={3}>
              <Typography sx={{ color: "white" }}>
                HOUSEHOLD INFORMATION
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    Total Members Of HouseHold
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0].total_members_of_household}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Expense / Month</Typography>
                  <Typography>
                    {studentDetails?.applications[0].expense_per_month}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Total Amount</Typography>
                  <Typography>
                    {studentDetails?.applications[0].total_amount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Info Of HouseHold</Typography>
                  <Typography>
                    {studentDetails?.applications[0].description_of_household}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={headerStyle} mt={3}>
              <Typography sx={{ color: "white" }}>
                PERSONAL STATEMENT
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} md={12}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">
                    Personal Statement
                  </Typography>
                  <Typography>
                    {studentDetails?.applications[0].personal_statement}
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
                    {studentDetails?.applications?.[0]?.degree_documents?.map(
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
                    {studentDetails?.applications?.[0]?.transcript_documents?.map(
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
                    {studentDetails?.applications?.[0]?.income_statement_documents?.map(
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
                      src={studentDetails?.applications?.[0]?.profile_picture}
                      alt="Profile"
                      style={{ maxWidth: "100px", borderRadius: "8px" }}
                    />
                    <Typography>
                      <a
                        href={
                          studentDetails?.applications?.[0]?.profile_picture
                        }
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
                  {studentDetails?.applications?.[0]?.degree ? (
                    studentDetails.applications[0].degree.map((degree) => (
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

export default StudentApplicationDetails;
