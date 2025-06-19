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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateVerificationForm = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
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
  // State to track form errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error message when the field value changes
    setFormErrors({ ...formErrors, [name]: "" });
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
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields before submitting
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Exit the function if there are validation errors
    }
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
        console.log("sucessfully created verification");
        // Verification created successfully, redirect to the verification list page or any other page
        navigate("/Admin/allVarification");
      } else {
        // Handle error response
        const errorMessage = await response.json(); // Parse error response as JSON
        if (errorMessage.application) {
          // If there is an error related to the application field
          alert(errorMessage.application[0]); // Display the error message to the user
        } else {
          // If there is a generic error
          console.error("Failed to create verification:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error creating verification:", error);
    }
  };

  // Function to validate form fields
  const validateForm = (formData) => {
    const errors = {};
    // Validate each field and set error messages if validation fails
    if (!formData.verifier_name.trim()) {
      errors.verifier_name = "Verifier name is required";
    }
    if (!formData.verifier_email.trim()) {
      errors.verifier_email = "Verifier email is required";
    } else if (!isValidEmail(formData.verifier_email)) {
      errors.verifier_email = "Invalid email format";
    }
    if (!formData.verifier_contact.trim()) {
      errors.verifier_contact = "Verifier contact is required";
    } else if (!isValidPhoneNumber(formData.verifier_contact)) {
      errors.verifier_contact = "Invalid phone number format";
    }
    if (!formData.verification_method.trim()) {
      errors.verification_method = "Verification method is required";
    }
    if (!formData.recommendation.trim()) {
      errors.recommendation = "Recommendation is required";
    }
    // Validate verification_date field
    if (!formData.verification_date) {
      errors.verification_date = "Verification date is required";
    }
    // Add validation for other fields as needed
    return errors;
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    // Implement email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Function to validate phone number format
  const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{1,16}$/.test(phoneNumber); // Allows 1 to 16 digits
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: 2,
      }}
    >
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ADD VERIFICATION
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Application"
                  variant="outlined"
                  name="application"
                  value={formData.application}
                  onChange={handleChange}
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.application} // Set error state based on formErrors
                  helperText={formErrors.application} // Display error message if exists
                >
                  {applications.map((application) => (
                    <MenuItem key={application.id} value={application.id}>
                      {application.name} {application.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Verifier name"
                  variant="outlined"
                  name="verifier_name"
                  value={formData.verifier_name}
                  onChange={handleChange}
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.verifier_name} // Set error state based on formErrors
                  helperText={formErrors.verifier_name} // Display error message if exists
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
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.verifier_email} // Set error state based on formErrors
                  helperText={formErrors.verifier_email} // Display error message if exists
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Verifier Contact"
                  variant="outlined"
                  name="verifier_contact"
                  value={formData.verifier_contact}
                  onChange={handleChange}
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.verifier_contact} // Set error state based on formErrors
                  helperText={formErrors.verifier_contact} // Display error message if exists
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Verification Date</InputLabel>
                <TextField
                  // label="Verification Date"
                  type="date"
                  variant="outlined"
                  name="verification_date"
                  value={formData.verification_date}
                  onChange={handleChange}
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.verification_date} // Set error state based on formErrors
                  helperText={formErrors.verification_date}
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
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.verification_method} // Set error state based on formErrors
                  helperText={formErrors.verification_method}
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
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.recommendation} // Set error state based on formErrors
                  helperText={formErrors.recommendation}
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
                  fullWidth
                  required // Make the field required
                  error={!!formErrors.move_for_interview} // Set error state based on formErrors
                  helperText={formErrors.move_for_interview}
                >
                  <MenuItem value="-">-</MenuItem>
                  <MenuItem value="yes">yes</MenuItem>
                  <MenuItem value="no">no</MenuItem>
                </TextField>
              </Grid>
              {/* <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              variant="outlined"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            />
          </Grid> */}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  marginTop: 20,
                  marginLeft: 300,
                  paddingRight: 30,
                  paddingLeft: 30,
                }}
              >
                Submit
              </Button>
            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateVerificationForm;
