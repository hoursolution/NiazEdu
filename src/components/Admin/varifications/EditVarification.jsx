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
import { useNavigate, useParams } from "react-router-dom";

const EditVerificationForm = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const { verificationId } = useParams(); // Get the verification ID from the URL

  const [verificationData, setVerificationData] = useState({
    verifier_name: "",
    verifier_email: "",
    verifier_contact: "",
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

  useEffect(() => {
    // Fetch applications from the API
    fetch(`${BASE_URL}/all-applications/`)
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched applications to state
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the verification data by ID
    fetch(`${BASE_URL}/api/verifications/${verificationId}/`)
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched verification data to state
        setVerificationData(data);
      })
      .catch((error) => {
        console.error("Error fetching verification data:", error);
      });
  }, [verificationId]); // Fetch data when the verification ID changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(verificationData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/verifications/update/${verificationId}/`, // Use the API endpoint for updating verifications
        {
          method: "PUT", // Use PUT method for updating data
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        }
      );
      if (response.ok) {
        console.log("Successfully updated verification");
        navigate("/Admin/allVarification"); // Navigate to verification list page after successful update
      } else {
        const errorMessage = await response.json();
        console.error("Failed to update verification:", errorMessage);
      }
    } catch (error) {
      console.error("Error updating verification:", error);
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
        <Typography
          variant="h4"
          fontWeight={700}
          className=" text-sky-950"
          align="center"
          gutterBottom
        >
          Edit Verification
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Application</InputLabel>
                <TextField
                  select
                  // label="Select Application"
                  variant="outlined"
                  name="application"
                  value={verificationData.application}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }} // Make the field required
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
                <InputLabel shrink>Verifier name</InputLabel>
                <TextField
                  // label="Verifier name"
                  variant="outlined"
                  name="verifier_name"
                  value={verificationData.verifier_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.verifier_name}
                  helperText={formErrors.verifier_name}
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
                  fullWidth
                  required
                  error={!!formErrors.verifier_email}
                  helperText={formErrors.verifier_email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Verifier Contact"
                  variant="outlined"
                  name="verifier_contact"
                  value={verificationData.verifier_contact}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.verifier_contact}
                  helperText={formErrors.verifier_contact}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Verification Date</InputLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  name="verification_date"
                  value={verificationData.verification_date}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.verification_date}
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
                  value={verificationData.verification_method}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.verification_method}
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
                  value={verificationData.recommendation}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.recommendation}
                  helperText={formErrors.recommendation}
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
                  error={!!formErrors.move_for_interview}
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
      /
    </Container>
  );
};

export default EditVerificationForm;
