import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Typography,
} from "@mui/material";

const GENDER_CHOICES = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const EditStudentForm = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const [formData, setFormData] = useState({
    student_name: "",
    father_name: "",
    email: "",
    last_name: "",
    gender: "",
    user: "",
    username: "",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch student data for editing
    fetch(`${BASE_URL}/api/studentDetails/${studentId}/`)
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });

    // Fetch users for the dropdown
    fetch(`${BASE_URL}/api/user/`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/students/edit/${studentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        console.log("Student details updated successfully");
        navigate(-1);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to update student details:", errorMessage);
      }
    } catch (error) {
      console.error("Error updating student details:", error);
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
        <Typography variant="h4" align="center" gutterBottom>
          EDIT STUDENT
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="father_name"
                label="Father's Name"
                value={formData.father_name}
                onChange={handleChange}
                fullWidth
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
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
              >
                {GENDER_CHOICES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                name="user"
                label="User CNIC/B-Form"
                value={formData.user}
                onChange={handleChange}
                fullWidth
                helperText="will be consider as student username"
                InputProps={{
                  readOnly: true,
                }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Update Student
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default EditStudentForm;
