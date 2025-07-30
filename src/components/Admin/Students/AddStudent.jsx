import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
const GENDER_CHOICES = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const CreateStudentForm = () => {
  const navigate = useNavigate();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    student_name: "",
    father_name: "",
    email: "",
    cnic: "",
    last_name: "",
    gender: "",
  });
  const handleCloseAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    // Fetch student data for editing
    // fetch(`http://127.0.0.1:8000/api/studentDetails/${studentId}/`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setFormData(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching student data:", error);
    //   });u

    // Fetch users for the dropdown
    fetch(`${BASE_URL}/api/user/`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/students/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Student created successfully");
        navigate(-1);
      } else {
        const errorMessage = await response.json();
        if (error.response && error.response.data) {
          // Username already exists error

          setAlert({ severity: "error", message: error.response.data });
        } else {
          // Other errors
          setAlert({
            severity: "error",
            message: "user with this name already exist",
          });
          console.error("Failed to create student:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
        minHeight: "100vh",
      }}
    >
      <Paper
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingX: 3,
          paddingY: 2,
          maxHeight: "calc(100vh - 150px)", // Adjust height to allow room for buttons
        }}
      >
        {error && (
          <Alert severity="error" style={{ marginBottom: 10 }}>
            {error}
          </Alert>
        )}
        <Typography variant="h4" align="center" gutterBottom>
          ADD STUDENT
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="student_name"
                label="Student Name"
                value={formData.student_name}
                onChange={handleChange}
                fullWidth
                requireds
                helperText="Password = studentname123"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="father_name"
                label="Father's Name"
                value={formData.father_name}
                onChange={handleChange}
                fullWidth
                // required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="cnic"
                label="B-form / CNIC"
                type="number"
                value={formData.cnic}
                onChange={handleChange}
                fullWidth
                required
                helperText="will be consider as student username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                // required
                // helperText="will be consider as student username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                name="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                required
              >
                {GENDER_CHOICES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Student
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity={alert?.severity}
        >
          {alert?.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CreateStudentForm;
