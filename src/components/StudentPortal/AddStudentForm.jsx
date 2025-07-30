import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AddStudentForm = () => {
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const [formData, setFormData] = useState({
    name: "",
    fathers_name: "",
    date_of_birth: "",
    gender: "",
    country: "",
    province: "",
    city: "",
    mobile_number: "",
    email: "",
    village: "",
    financial_need: "",
    career_goals: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `${BASE_URL}/api/students/`;

    const method = "POST"; // Use PUT for updates, POST for new submissions

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(
          `Failed to submit the form. Server response: ${errorMessage}`
        );
        return;
      }

      // Reset the form after successful submission
      setFormData({
        name: "",
        fathers_name: "",
        date_of_birth: "",
        gender: "",
        country: "",
        province: "",
        city: "",
        mobile_number: "",
        email: "",
        village: "",
        financial_need: "",
        career_goals: "",
      });
    } catch (error) {
      console.error("Error submitting the form:", error.message);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Add New Student
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="fathers_name"
              name="fathers_name"
              value={formData.fathers_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="financial_need"
              name="financial_need"
              value={formData.financial_need}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="career_goals"
              name="career_goals"
              value={formData.career_goals}
              onChange={handleChange}
            />
          </Grid>
          {/* Add other form fields similar to the one above */}
        </Grid>
        <Button type="submit" variant="contained" style={{ marginTop: "20px" }}>
          Add Student
        </Button>
      </form>
    </Paper>
  );
};

export default AddStudentForm;
