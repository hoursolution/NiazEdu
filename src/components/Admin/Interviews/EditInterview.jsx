import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  InputLabel,
  Typography,
  Container,
  Box,
  CircularProgress, // Added for loading state on submit
  Snackbar, // Added for notifications
  Alert, // Added for notifications
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/system"; // Import styled for custom components

// --- Modern Color Palette & Theme Variables (Conceptual) ---
// In a real application, these would ideally be part of a Material-UI theme
// defined using createTheme from @mui/material/styles.
const colors = {
  primary: "#0f75bd", // A vibrant blue
  secondary: "#6c757d", // Muted grey
  accent: "#20ace0", // Green for success
  backgroundLight: "#f8f9fa", // Very light grey background
  paperBackground: "#ffffff", // White for paper
  textPrimary: "#343a40", // Dark grey for text
  textSecondary: "#6c757d", // Muted grey for secondary text
  border: "#ced4da", // Light border color
  hoverLight: "#e9ecef", // Light hover for tabs/menu items
  error: "#D32F2F", // Standard Material-UI error red
};

// --- Styled Components for Animations and Modern Look ---
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4), // Increased padding
  marginBottom: theme.spacing(4), // Increased margin
  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
  background: `linear-gradient(145deg, ${colors.paperBackground}, #f0f2f5)`, // Subtle gradient
  boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)`, // Enhanced shadow
  transition: "transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)", // More pronounced lift
    boxShadow: `0px 15px 40px rgba(0, 0, 0, 0.12), 0px 6px 18px rgba(0, 0, 0, 0.08)`, // Deeper shadow on hover
  },
}));

const AnimatedTabPanel = styled(Box)(({ theme }) => ({
  opacity: 0,
  transform: "translateY(20px)",
  transition: "opacity 0.6s ease-in-out, transform 0.6s ease-in-out", // Slower, smoother transition
  "&.active": {
    opacity: 1,
    transform: "translateY(0)",
  },
}));

const EditInterviewForm = () => {
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const navigate = useNavigate();
  const { InterviewId } = useParams();
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State for snackbar type

  const [formData, setFormData] = useState({
    application: null,
    interviewer_name: "",
    interview_date: "",
    question_1: "",
    question_2: "",
    question_3: "",
    question_4: "",
    question_5: "",
    question_6: "",
    question_7: "",
    question_8: "",
    question_9: "",
    question_10: "",
    interviewer_recommendation: "",
    Accepted: "-",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Fetch interview data for editing
    fetch(`${BASE_URL}/api/interviews/${InterviewId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Format date for TextField type="date"
        if (data.interview_date) {
          data.interview_date = new Date(data.interview_date)
            .toISOString()
            .split("T")[0];
        }
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching interview data:", error);
        setSnackbarMessage("Failed to load interview data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });

    // Fetch applications from the API
    fetch(`${BASE_URL}/all-applications/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setSnackbarMessage("Failed to load applications.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, [InterviewId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on change
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
  };

  const handleContinue = () => {
    let currentTabFields = [];
    if (activeTab === 0) {
      currentTabFields = ["application", "interviewer_name", "interview_date"];
    } else if (activeTab === 1) {
      for (let i = 1; i <= 10; i++) {
        currentTabFields.push(`question_${i}`);
      }
    } else if (activeTab === 2) {
      currentTabFields = ["interviewer_recommendation", "Accepted"];
    }

    let hasErrors = false;
    const newErrors = { ...formErrors };
    currentTabFields.forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      if (Object.keys(fieldErrors).length > 0) {
        hasErrors = true;
        Object.assign(newErrors, fieldErrors);
      }
    });

    setFormErrors(newErrors);

    if (hasErrors) {
      setSnackbarMessage(
        "Please fill in all required fields in the current section before continuing."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setActiveTab((prevTab) => Math.min(prevTab + 1, 2)); // Adjust the upper limit based on the number of tabs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setSnackbarMessage("Please correct the errors in the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${BASE_URL}/api/interviews/${InterviewId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setSnackbarMessage("Interview updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/Admin/allInterviews");
        }, 1000); // Navigate after a short delay to show snackbar
      } else {
        const errorMessage = await response.json();
        let message = "Failed to update interview.";
        if (errorMessage.application) {
          message = errorMessage.application[0];
        } else if (errorMessage.detail) {
          message = errorMessage.detail;
        }
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Failed to update interview:", errorMessage);
      }
    } catch (error) {
      setSnackbarMessage("Error updating interview. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating interview:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case "application":
        if (!value) errors.application = "Please select an application";
        break;
      case "interviewer_name":
        if (!value.trim())
          errors.interviewer_name = "Interviewer name is required";
        break;
      case "interview_date":
        if (!value) errors.interview_date = "Interview date is required";
        break;
      case "interviewer_recommendation":
        if (!value.trim())
          errors.interviewer_recommendation =
            "Interviewer recommendation is required";
        break;
      case "Accepted":
        if (value === "-")
          errors.Accepted =
            "Please select whether the interview was accepted or not";
        break;
      default:
        // if (name.startsWith("question_")) {
        //   if (!value.trim()) {
        //     const questionNumber = name.split("_")[1];
        //     errors[name] = `Question ${questionNumber} is required`;
        //   }
        // }
        break;
    }
    return errors;
  };

  const validateForm = (data) => {
    let errors = {};

    errors = {
      ...validateField("application", data.application),
      ...validateField("interviewer_name", data.interviewer_name),
      ...validateField("interview_date", data.interview_date),
    };

    // for (let i = 1; i <= 10; i++) {
    //   errors = {
    //     ...errors,
    //     ...validateField(`question_${i}`, data[`question_${i}`]),
    //   };
    // }

    errors = {
      ...errors,
      ...validateField(
        "interviewer_recommendation",
        data.interviewer_recommendation
      ),
      ...validateField("Accepted", data.Accepted),
    };

    return errors;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        // paddingY: 4,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Scrollable Form Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            paddingX: 3,
            paddingY: 2,
            maxHeight: "calc(100vh - 150px)", // Adjust height to allow room for buttons
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: colors.textPrimary, // Use defined color
              fontWeight: 700, // Bolder
              letterSpacing: "0.05em", // Slightly spaced out
              marginBottom: 4, // More space below heading
            }}
          >
            EDIT INTERVIEW
          </Typography>
          <form onSubmit={handleSubmit}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary" // Use primary color for indicator
              textColor="primary" // Use primary color for text
              sx={{
                marginTop: 2,
                marginBottom: 4, // More space below tabs
                "& .MuiTab-root": {
                  textTransform: "none", // Prevent uppercase
                  fontSize: "1rem", // Slightly larger font
                  fontWeight: 600, // Bolder tab labels
                  color: colors.textSecondary, // Muted color for inactive tabs
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, transform 0.2s ease-out",
                  "&:hover": {
                    backgroundColor: colors.hoverLight, // Light hover effect
                    color: colors.primary, // Highlight text on hover
                    transform: "translateY(-2px)", // Subtle lift on hover
                  },
                },
                "& .Mui-selected": {
                  backgroundColor: colors.primary, // Active tab color
                  color: "white !important", // Ensure text color is white for active tab
                  borderTopLeftRadius: "8px", // More rounded
                  borderTopRightRadius: "8px",
                  boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`, // Subtle shadow for selected tab
                  transform: "translateY(0)", // Reset transform for selected
                },
                "& .MuiTabs-indicator": {
                  height: "4px", // Thicker indicator
                  borderRadius: "2px", // Rounded indicator
                  background: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.secondary} 90%)`, // Gradient indicator
                },
              }}
            >
              <Tab label="Interview Information" />
              <Tab label="Questions" />
              <Tab label="Other Information" />
            </Tabs>

            <AnimatedTabPanel
              className={activeTab === 0 ? "active" : ""}
              sx={{ marginTop: 3 }}
            >
              {activeTab === 0 && (
                <Grid container spacing={4}>
                  {" "}
                  {/* Increased spacing */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Select Application"
                      variant="outlined"
                      name="application"
                      value={formData.application || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={!!formErrors.application}
                      helperText={formErrors.application}
                      InputLabelProps={{ shrink: true }} // Always shrink label
                      InputProps={{
                        readOnly: true, // Keep this as per original requirement
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px", // Rounded input fields
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary, // Primary color on focus
                          },
                        },
                      }}
                    >
                      {applications.map((application) => (
                        <MenuItem
                          key={application.id}
                          value={application.id}
                          sx={{
                            "&:hover": { backgroundColor: colors.hoverLight },
                          }}
                        >
                          {application.name} {application.last_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Interviewer Name"
                      variant="outlined"
                      name="interviewer_name"
                      value={formData.interviewer_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={!!formErrors.interviewer_name}
                      helperText={formErrors.interviewer_name}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="Interview Date" // Label directly on TextField
                      variant="outlined"
                      name="interview_date"
                      value={formData.interview_date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={!!formErrors.interview_date}
                      helperText={formErrors.interview_date}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </AnimatedTabPanel>

            <AnimatedTabPanel
              className={activeTab === 1 ? "active" : ""}
              sx={{ marginTop: 3 }}
            >
              {activeTab === 1 && (
                <Box
                  sx={{
                    maxHeight: "calc(84vh - 250px)",
                    overflowY: "auto",
                    paddingRight: 2, // More padding for scrollbar
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: colors.border,
                      borderRadius: "10px",
                      "&:hover": {
                        background: colors.textSecondary,
                      },
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: colors.textPrimary,
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    Section 1: Questionnaire from Parent/Guardian
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        1. Child’s Full Name, Age, and Current Grade
                      </InputLabel>
                      <TextField
                        name="question_1"
                        multiline
                        rows={2}
                        value={formData.question_1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_1}
                        helperText={formErrors.question_1}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        2. Parent/Guardian Name and Occupation
                      </InputLabel>
                      <TextField
                        name="question_2"
                        multiline
                        rows={2}
                        value={formData.question_2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_2}
                        helperText={formErrors.question_2}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        3. Monthly Family Income in PKR
                      </InputLabel>
                      <TextField
                        name="question_3"
                        select
                        value={formData.question_3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_3}
                        helperText={formErrors.question_3}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      >
                        <MenuItem
                          value="Less than 25,000"
                          sx={{
                            "&:hover": { backgroundColor: colors.hoverLight },
                          }}
                        >
                          Less than 25,000
                        </MenuItem>
                        <MenuItem
                          value="Between 25,000 - 50,000"
                          sx={{
                            "&:hover": { backgroundColor: colors.hoverLight },
                          }}
                        >
                          Between 25,000 - 50,000
                        </MenuItem>
                        <MenuItem
                          value="More than 50,000"
                          sx={{
                            "&:hover": { backgroundColor: colors.hoverLight },
                          }}
                        >
                          More than 50,000
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        4. How many children are in your family? How many are
                        currently attending school?
                      </InputLabel>
                      <TextField
                        name="question_4"
                        multiline
                        rows={2}
                        value={formData.question_4}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_4}
                        helperText={formErrors.question_4}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        5. Has your child previously attended a school?
                      </InputLabel>
                      <TextField
                        name="question_5"
                        multiline
                        rows={2}
                        value={formData.question_5}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        placeholder="Yes → Name of school: ____ / No → Reason: ____"
                        error={!!formErrors.question_5}
                        helperText={formErrors.question_5}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        6. What challenges do you face in sending your child to
                        school?
                      </InputLabel>
                      <TextField
                        name="question_6"
                        multiline
                        rows={2}
                        value={formData.question_6}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        placeholder="e.g., Financial problems, transport issues, health, etc."
                        error={!!formErrors.question_6}
                        helperText={formErrors.question_6}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        mt={4}
                        sx={{
                          color: colors.textPrimary,
                          fontWeight: 600,
                          marginBottom: 3,
                        }}
                      >
                        Section 2: Questionnaire from Child
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        7. What is your favorite subject in school and why?
                      </InputLabel>
                      <TextField
                        name="question_7"
                        multiline
                        rows={2}
                        value={formData.question_7}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_7}
                        helperText={formErrors.question_7}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        8. What do you want to be when you grow up?
                      </InputLabel>
                      <TextField
                        name="question_8"
                        multiline
                        rows={2}
                        value={formData.question_8}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_8}
                        helperText={formErrors.question_8}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        9. What do you enjoy most about going to school?
                      </InputLabel>
                      <TextField
                        name="question_9"
                        multiline
                        rows={2}
                        value={formData.question_9}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        placeholder="e.g., learning, friends, drawing, stories, games"
                        error={!!formErrors.question_9}
                        helperText={formErrors.question_9}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel sx={{ marginBottom: 1, fontWeight: 500 }}>
                        10. Do you like reading or writing at home? What do you
                        enjoy reading or writing about?
                      </InputLabel>
                      <TextField
                        name="question_10"
                        multiline
                        rows={2}
                        value={formData.question_10}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formErrors.question_10}
                        helperText={formErrors.question_10}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&.Mui-focused fieldset": {
                              borderColor: colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </AnimatedTabPanel>

            <AnimatedTabPanel
              className={activeTab === 2 ? "active" : ""}
              sx={{ marginTop: 3 }}
            >
              {activeTab === 2 && (
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      label="Interviewer Recommendation"
                      variant="outlined"
                      name="interviewer_recommendation"
                      multiline
                      rows={3}
                      value={formData.interviewer_recommendation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={!!formErrors.interviewer_recommendation}
                      helperText={formErrors.interviewer_recommendation}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Accepted"
                      variant="outlined"
                      name="Accepted"
                      value={formData.Accepted}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      required
                      error={!!formErrors.Accepted}
                      helperText={formErrors.Accepted}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary,
                          },
                        },
                      }}
                    >
                      <MenuItem
                        value="-"
                        sx={{
                          "&:hover": { backgroundColor: colors.hoverLight },
                        }}
                      >
                        -
                      </MenuItem>
                      <MenuItem
                        value="yes"
                        sx={{
                          "&:hover": { backgroundColor: colors.hoverLight },
                        }}
                      >
                        Yes
                      </MenuItem>
                      <MenuItem
                        value="no"
                        sx={{
                          "&:hover": { backgroundColor: colors.hoverLight },
                        }}
                      >
                        No
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              )}
            </AnimatedTabPanel>

            <Box
              sx={{
                marginTop: 6, // More space above buttons
                display: "flex",
                justifyContent: "flex-end",
                gap: 2, // Space between buttons
              }}
            >
              <Button
                variant="contained"
                disabled={activeTab === 0 || loading}
                onClick={handleBack}
                sx={{
                  backgroundColor: colors.secondary, // Muted color for back
                  color: "white",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "none", // Remove default shadow
                  "&:hover": {
                    backgroundColor: "#7B1FA2", // Darker on hover
                    boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`, // Subtle shadow on hover
                    transform: "translateY(-2px)", // Lift on hover
                  },
                  transition:
                    "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease-out",
                }}
              >
                Back
              </Button>
              {activeTab < 2 && (
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={handleContinue}
                  sx={{
                    backgroundColor: colors.primary, // Primary color for continue
                    color: "white",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`, // Subtle shadow
                    "&:hover": {
                      backgroundColor: "#5A046F", // Darker on hover
                      boxShadow: `0px 6px 15px rgba(0, 0, 0, 0.15)`, // Deeper shadow on hover
                      transform: "translateY(-2px)", // Lift on hover
                    },
                    transition:
                      "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease-out",
                  }}
                >
                  Continue
                </Button>
              )}
              {activeTab === 2 && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary" // This will use the primary color from the theme if defined, or the default Material-UI primary
                  disabled={loading}
                  sx={{
                    backgroundColor: colors.accent, // Accent color for submit
                    color: "white",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
                    "&:hover": {
                      backgroundColor: "#00A040", // Darker on hover
                      boxShadow: `0px 6px 15px rgba(0, 0, 0, 0.15)`,
                      transform: "translateY(-2px)",
                    },
                    transition:
                      "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease-out",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "UPDATE INTERVIEW"
                  )}
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: `0px 4px 15px rgba(0, 0, 0, 0.1)`,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditInterviewForm;
