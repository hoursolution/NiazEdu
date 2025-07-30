import { BorderBottom } from "@mui/icons-material";
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
  styled,
  Container,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  animation: `${fadeIn} 0.8s ease`,
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  background: "#ffffff",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: "100%", // Ensures full width
  marginTop: theme.spacing(2),
  "& .MuiTabs-indicator": {
    height: 6,
    background: "linear-gradient(90deg, #4361ee, #3a0ca3)",
    borderRadius: "2px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  color: "#64748b",
  textTransform: "capitalize",
  fontSize: "0.9rem",
  "&.Mui-selected": {
    color: "#4361ee",
    backgroundColor: "rgba(67, 97, 238, 0.08)",
  },
  transition: "all 0.3s ease",
}));

const StudentApplicationDetails = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [projections, setProjections] = useState([]);
  const [studentId, setStudentId] = useState("");
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
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
    color: accentColor,
    fontWeight: "bold",
    textAlign: "center",
  };

  const textStyle = {
    fontWeight: 700,
    fontSize: "14px",
  };

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
          if (response.status === 404) {
            // Optionally handle student not found
            navigate("/student/addapplication");
          } else {
            console.error(
              "Error fetching student details:",
              response.statusText
            );
          }
          return;
        }

        const data = await response.json();

        // Redirect if student has no applications
        if (!data.applications || data.applications.length === 0) {
          navigate("/student/addapplication");
          return;
        }

        setStudentDetails({
          ...data,
          ...data.applications[data.applications.length - 1],
        });
        setProjections(data.projections || []);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [navigate]);

  return (
    <div className="h-screen">
      <Box sx={{ width: "100%" }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <StyledTab label="Informations" />
          <StyledTab label="Statements" />
          <StyledTab label="Documents" />
        </StyledTabs>
      </Box>

      {activeTab === 0 && (
        <Paper
          sx={{
            marginTop: 0.2,
            padding: 1,
            borderRadius: 3,
            width: "100%",
            paddingBottom: 18,
          }}
        >
          <Box>
            {/* Header */}
            <Box
              sx={{
                ...headerStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Personal Info
              </Typography>

              {studentDetails?.education_status && (
                <Typography
                  align="center"
                  sx={{
                    color: "green",
                    fontWeight: "bold",
                    border: ".5px solid green",
                    borderRadius: "8px",
                    padding: "2px 4px",
                    backgroundColor: "#e6f4ea",
                    display: "inline-block",
                  }}
                >
                  {studentDetails.education_status}
                </Typography>
              )}
            </Box>
            <Divider
              sx={{
                width: "100%",
                mt: 1,
                borderBottomWidth: 1,
                borderColor: accentColor,
              }}
            />

            {/* persnal info */}
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle1" sx={textStyle}>
                    Name
                  </Typography>
                  <Typography>{studentDetails?.student_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle1" sx={textStyle}>
                    Status
                  </Typography>
                  <Typography>{studentDetails?.status}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Father Name
                  </Typography>
                  <Typography>{studentDetails?.father_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Last Name
                  </Typography>
                  <Typography>{studentDetails?.last_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Date of Birth
                  </Typography>
                  <Typography>{studentDetails?.date_of_birth}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Age
                  </Typography>
                  <Typography>{studentDetails?.age}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Gender
                  </Typography>
                  <Typography>{studentDetails?.gender}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Mobile No
                  </Typography>
                  <Typography>{studentDetails?.mobile_no}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    CNIC / B-FORM
                  </Typography>
                  <Typography>{studentDetails?.cnic_or_b_form}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Email
                  </Typography>
                  <Typography>{studentDetails?.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Country
                  </Typography>
                  <Typography>{studentDetails?.country}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Province
                  </Typography>
                  <Typography>{studentDetails?.province}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    City
                  </Typography>
                  <Typography>{studentDetails?.city}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={columnStyle}>
                  <Typography sx={textStyle}>Address</Typography>
                  <Typography>{studentDetails?.address}</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Educational Information */}
            <Box
              sx={{
                ...headerStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                marginTop: "10px",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Educational Information
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                width: "100%",
                mt: 1,
                borderBottomWidth: 1,
                borderColor: accentColor,
              }}
            />
            <Grid container spacing={2} sx={{ marginTop: 0.2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Current Level
                  </Typography>
                  <Typography>
                    {studentDetails?.current_level_of_education}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Program Interested In
                  </Typography>
                  <Typography>{studentDetails?.grade_interested_in}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Institution Interested In
                  </Typography>
                  <Typography>
                    {studentDetails?.institution_interested_in}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    No Of Years
                  </Typography>
                  <Typography>{studentDetails?.no_of_years}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    No Of Semesters
                  </Typography>
                  <Typography>{studentDetails?.no_of_semesters}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    No Of Semesters
                  </Typography>
                  <Typography>
                    {studentDetails?.program_addmision_date}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    No Of Semesters
                  </Typography>
                  <Typography>
                    {studentDetails?.classes_commencement_date}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/*  Financial Information */}
            <Box
              sx={{
                ...headerStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                marginTop: "10px",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Financial Information
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                width: "100%",
                mt: 1,
                borderBottomWidth: 1,
                borderColor: accentColor,
              }}
            />
            <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    Addmission Fee Of Program
                  </Typography>
                  <Typography>
                    {studentDetails?.admission_fee_of_the_program}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    {" "}
                    Total Fee Of Program
                  </Typography>
                  <Typography>
                    {studentDetails?.total_fee_of_the_program}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    {" "}
                    Living Expenses / Year
                  </Typography>
                  <Typography>{studentDetails?.living_expenses}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    {" "}
                    Food And Necessities Expenses / Year
                  </Typography>
                  <Typography>
                    {studentDetails?.food_and_necessities_expenses}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    {" "}
                    Transport Amount / Year
                  </Typography>
                  <Typography>{studentDetails?.transport_amount}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    {" "}
                    Other Cost / Year
                  </Typography>
                  <Typography>{studentDetails?.other_amount}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2" sx={textStyle}>
                    {" "}
                    Expected Sponsorship Amount
                  </Typography>
                  <Typography>
                    {studentDetails?.expected_sponsorship_amount}
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
            marginTop: 0.2,
            padding: 1,
            borderRadius: 3,
            width: "100%",
            paddingBottom: 18,
          }}
        >
          <Box>
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
                    {studentDetails?.total_members_of_household}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Expense / Month</Typography>
                  <Typography>{studentDetails?.expense_per_month}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Total Amount</Typography>
                  <Typography>{studentDetails?.total_amount}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={columnStyle}>
                  <Typography variant="subtitle2">Info Of HouseHold</Typography>
                  <Typography>
                    {studentDetails?.description_of_household}
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
                  <Typography>{studentDetails?.personal_statement}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      {activeTab === 2 && (
        <Paper
          sx={{
            marginTop: 0.2,
            padding: 1,
            borderRadius: 3,
            width: "100%",
            paddingBottom: 18,
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
                    {studentDetails?.degree_documents?.map(
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
                    {studentDetails?.transcript_documents?.map(
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
                    {studentDetails?.income_statement_documents?.map(
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
                      src={studentDetails?.profile_picture}
                      alt="Profile"
                      style={{ maxWidth: "100px", borderRadius: "8px" }}
                    />
                    {/* 
                    <a
                      href={studentDetails?.[0]?.profile_picture}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "#148581" }}
                    >
                      View Profile
                    </a> */}
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
                  {studentDetails?.degree ? (
                    studentDetails.degree.map((degree) => (
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
