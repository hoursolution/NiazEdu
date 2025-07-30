import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  InputLabel,
  Container,
  Typography,
  Box,
  CircularProgress, // Added for loading state on submit
  Snackbar, // Added for notifications
  Alert,
  Hidden, // Added for notifications
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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

const CreateVerificationForm = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State for snackbar type

  const [formData, setFormData] = useState({
    verifier_name: "",
    verifier_email: "",
    verification_date: "",
    verifier_contact: "",
    verification_method: "",
    recommendation: "",
    move_for_interview: "-",
    application: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error message when the field value changes
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/verifications/`).then((res) => res.json()),
      fetch(`${BASE_URL}/all-applications/`).then((res) => res.json()),
    ])
      .then(([verifications, applications]) => {
        // Get IDs of all applications that are already verified
        const verifiedAppIds = new Set(
          verifications.map((v) => v.application?.id)
        );

        // Only include applications:
        // - status is "Accepted"
        // - not already verified
        const filteredApplications = applications.filter(
          (app) => app.status === "Accepted" && !verifiedAppIds.has(app.id)
        );

        setApplications(filteredApplications);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Failed to load applications.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields before submitting
    const errors = validateForm(formData);
    setFormErrors(errors); // Set all errors at once

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setSnackbarMessage("Please correct the errors in the form.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Exit the function if there are validation errors
    }

    setLoading(true); // Start loading
    try {
      // Submit the form data if validation passes
      const response = await fetch(`${BASE_URL}/api/verifications/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSnackbarMessage("Verification created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/Admin/allVarification");
        }, 1500); // Navigate after a short delay to show snackbar
      } else {
        // Handle error response
        const errorMessage = await response.json(); // Parse error response as JSON
        let message = "Failed to create verification.";
        if (errorMessage.application) {
          // If there is an error related to the application field
          message = errorMessage.application[0]; // Display the error message to the user
        } else if (errorMessage.detail) {
          message = errorMessage.detail;
        }
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Failed to create verification:", errorMessage);
      }
    } catch (error) {
      setSnackbarMessage("Error creating verification. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating verification:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Function to validate form fields
  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case "application":
        if (!value) errors.application = "Please select an application";
        break;
      case "verifier_name":
        if (!value.trim()) errors.verifier_name = "Verifier name is required";
        break;
      // case "verifier_email":
      //   if (!value.trim()) {
      //     errors.verifier_email = "Verifier email is required";
      //   } else if (!isValidEmail(value)) {
      //     errors.verifier_email = "Invalid email format";
      //   }
      //   break;
      case "verifier_contact":
        if (!value.trim()) {
          errors.verifier_contact = "Verifier contact is required";
        } else if (!isValidPhoneNumber(value)) {
          errors.verifier_contact = "Invalid phone number format (1-16 digits)";
        }
        break;
      case "verification_method":
        if (!value.trim())
          errors.verification_method = "Verification method is required";
        break;
      case "recommendation":
        if (!value.trim()) errors.recommendation = "Recommendation is required";
        break;
      case "verification_date":
        if (!value) errors.verification_date = "Verification date is required";
        break;
      case "move_for_interview":
        // Assuming this field is always selected, no specific validation needed unless default is not allowed
        break;
      default:
        break;
    }
    return errors;
  };

  const validateForm = (formData) => {
    let errors = {};
    errors = {
      ...validateField("application", formData.application),
      ...validateField("verifier_name", formData.verifier_name),
      // ...validateField("verifier_email", formData.verifier_email),
      ...validateField("verifier_contact", formData.verifier_contact),
      ...validateField("verification_method", formData.verification_method),
      ...validateField("recommendation", formData.recommendation),
      ...validateField("verification_date", formData.verification_date),
      ...validateField("move_for_interview", formData.move_for_interview),
    };
    return errors;
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Function to validate phone number format
  const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{1,16}$/.test(phoneNumber); // Allows 1 to 16 digits
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
        height: "100vh", // Fill viewport height
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // light elegant shadow
            borderRadius: "12px",
            backgroundColor: "#fff", // ensure background is white for proper shadow
            paddingX: 3,
            paddingBottom: "4px",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: colors.textPrimary,
              fontWeight: 700,
              letterSpacing: "0.05em",
              marginBottom: 2,
            }}
          >
            ADD VERIFICATION
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                pt: 2,
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
                paddingRight: 2,
                overflowX: "hidden",
                position: "relative", // Ensure children render within a known container
                "& .MuiInputLabel-shrink": {
                  backgroundColor: "#fff",
                  padding: "0 4px",
                  zIndex: 1,
                },
              }}
            >
              <Grid container spacing={4}>
                {/* Increased spacing */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Select Application"
                    variant="outlined"
                    name="application"
                    value={formData.application || ""} // Ensure controlled component
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.application}
                    helperText={formErrors.application}
                    // InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                        },
                      },
                    }}
                  >
                    {applications.length > 0 ? (
                      applications.map((application) => (
                        <MenuItem
                          key={application.id}
                          value={application.id}
                          sx={{
                            "&:hover": { backgroundColor: colors.hoverLight },
                          }}
                        >
                          {application.name} {application.last_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        No accepted applications available
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Verifier name"
                    variant="outlined"
                    name="verifier_name"
                    value={formData.verifier_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.verifier_name}
                    helperText={formErrors.verifier_name}
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
                    label="Verifier Email"
                    type="email"
                    variant="outlined"
                    name="verifier_email"
                    value={formData.verifier_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={!!formErrors.verifier_email}
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
                    label="Verifier Contact"
                    variant="outlined"
                    name="verifier_contact"
                    value={formData.verifier_contact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.verifier_contact}
                    helperText={formErrors.verifier_contact}
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
                    label="Verification Date"
                    variant="outlined"
                    name="verification_date"
                    value={formData.verification_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.verification_date}
                    helperText={formErrors.verification_date}
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
                <Grid item xs={12}>
                  <TextField
                    label="Verification Method"
                    variant="outlined"
                    name="verification_method"
                    multiline
                    rows={3}
                    value={formData.verification_method}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.verification_method}
                    helperText={formErrors.verification_method}
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
                <Grid item xs={12}>
                  <TextField
                    label="Recommendation"
                    variant="outlined"
                    name="recommendation"
                    multiline
                    rows={3}
                    value={formData.recommendation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.recommendation}
                    helperText={formErrors.recommendation}
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
                    label="Move for Interview"
                    variant="outlined"
                    select
                    name="move_for_interview"
                    value={formData.move_for_interview}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.move_for_interview}
                    helperText={formErrors.move_for_interview}
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
                      sx={{ "&:hover": { backgroundColor: colors.hoverLight } }}
                    >
                      -
                    </MenuItem>
                    <MenuItem
                      value="yes"
                      sx={{ "&:hover": { backgroundColor: colors.hoverLight } }}
                    >
                      yes
                    </MenuItem>
                    <MenuItem
                      value="no"
                      sx={{ "&:hover": { backgroundColor: colors.hoverLight } }}
                    >
                      no
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  backgroundColor: colors.accent, // Accent color for submit
                  color: "white",
                  borderRadius: "8px",
                  padding: "12px 40px", // Increased padding
                  fontSize: "1.1rem", // Slightly larger font
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
                  "Submit Verification"
                )}
              </Button>
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

export default CreateVerificationForm;
