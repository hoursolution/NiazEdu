import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/system";

// --- Modern Color Palette & Theme Variables ---
const colors = {
  primary: "#0f75bd",
  secondary: "#6c757d",
  accent: "#20ace0",
  backgroundLight: "#f8f9fa",
  paperBackground: "#ffffff",
  textPrimary: "#343a40",
  textSecondary: "#6c757d",
  border: "#ced4da",
  hoverLight: "#e9ecef",
  error: "#D32F2F",
};

// --- Styled Components for Animations and Modern Look ---
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, ${colors.paperBackground}, #f0f2f5)`,
  boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)`,
  transition: "transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0px 15px 40px rgba(0, 0, 0, 0.12), 0px 6px 18px rgba(0, 0, 0, 0.08)`,
  },
}));

const EditVerificationForm = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";
  const { verificationId } = useParams();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [verificationData, setVerificationData] = useState({
    verifier_name: "",
    verifier_email: "",
    verifier_contact: "",
    verification_date: "",
    verification_method: "",
    recommendation: "",
    move_for_interview: "-",
    application: null,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerificationData({ ...verificationData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  useEffect(() => {
    // Fetch applications
    fetch(`${BASE_URL}/all-applications/`)
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => {
        console.error("Error fetching applications:", error);
        showSnackbar("Failed to load applications.", "error");
      });

    // Fetch verification data
    fetch(`${BASE_URL}/api/verifications/${verificationId}/`)
      .then((response) => response.json())
      .then((data) => setVerificationData(data))
      .catch((error) => {
        console.error("Error fetching verification data:", error);
        showSnackbar("Failed to load verification data.", "error");
      });
  }, [verificationId]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(verificationData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      showSnackbar("Please correct the errors in the form.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/verifications/update/${verificationId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verificationData),
        }
      );

      if (response.ok) {
        showSnackbar("Verification updated successfully!", "success");
        setTimeout(() => navigate("/Admin/allVarification"), 1500);
      } else {
        const errorData = await response.json();
        const message = errorData.detail || "Failed to update verification";
        showSnackbar(message, "error");
      }
    } catch (error) {
      showSnackbar("Error updating verification. Please try again.", "error");
      console.error("Error updating verification:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validation functions (same as AddVerification)
  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
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
      default:
        break;
    }
    return errors;
  };

  const validateForm = (formData) => {
    return {
      ...validateField("verifier_name", formData.verifier_name),
      // ...validateField("verifier_email", formData.verifier_email),
      ...validateField("verifier_contact", formData.verifier_contact),
      ...validateField("verification_method", formData.verification_method),
      ...validateField("recommendation", formData.recommendation),
      ...validateField("verification_date", formData.verification_date),
    };
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhoneNumber = (phone) => /^\d{1,16}$/.test(phone);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh", // Fill viewport height
        overflow: "hidden",
        paddingTop: 2,
        paddingBottom: 6,
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
            EDIT VERIFICATION
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                pt: 2,
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
                paddingRight: 2,
                overflowX: "hidden",
                "& .MuiInputLabel-shrink": {
                  backgroundColor: "#fff",
                  padding: "0 4px",
                  zIndex: 1,
                },
              }}
            >
              <Grid container spacing={4}>
                {/* Application Field (Read-only) */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Application"
                    variant="outlined"
                    name="application"
                    value={verificationData.application || ""}
                    fullWidth
                    required
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary,
                        },
                      },
                    }}
                  >
                    {applications.map((app) => (
                      <MenuItem key={app.id} value={app.id}>
                        {app.name} {app.last_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Other Fields */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Verifier name"
                    variant="outlined"
                    name="verifier_name"
                    value={verificationData.verifier_name}
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
                    value={verificationData.verifier_email}
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
                    value={verificationData.verifier_contact}
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
                    value={verificationData.verification_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    error={!!formErrors.verification_date}
                    helperText={formErrors.verification_date}
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
                    label="Verification Method"
                    variant="outlined"
                    name="verification_method"
                    multiline
                    rows={3}
                    value={verificationData.verification_method}
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
                    value={verificationData.recommendation}
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
                    value={verificationData.move_for_interview}
                    onChange={handleChange}
                    fullWidth
                    required
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
                    <MenuItem value="-">-</MenuItem>
                    <MenuItem value="yes">yes</MenuItem>
                    <MenuItem value="no">no</MenuItem>
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
                  backgroundColor: colors.accent,
                  color: "white",
                  borderRadius: "8px",
                  padding: "12px 40px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "#00A040",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Verification"
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
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditVerificationForm;
