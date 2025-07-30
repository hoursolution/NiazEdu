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
  Container,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const CreateSelectMentorForm = () => {
  const navigate = useNavigate();
  const [students, setstudents] = useState([]);
  const [alert, setAlert] = useState(null);
  const handleCloseAlert = () => {
    setAlert(null);
  };
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const [mentors, setmentors] = useState([]);
  const [formData, setFormData] = useState({
    student: "",
    mentor: "",
    selection_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // setFormErrors({ ...formErrors, [name]: "" });
  };

  useEffect(() => {
    // Fetch students and donors from the API

    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setstudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
    fetch(`${BASE_URL}/api/mentor/`)
      .then((response) => response.json())
      .then((data) => {
        setmentors(data);
      })
      .catch((error) => {
        console.error("Error fetching donors:", error);
      });
  }, []);
  const handleAddMentorClick = () => {
    navigate("/Admin/createMentor"); // Navigate to absolute path
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/select-mentor/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (response.ok) {
        setAlert({
          severity: "success",
          message: "successfully created select-mentor",
        });
        console.log("successfully created select-mentor");
        setTimeout(() => {
          navigate("/Admin/selectMentor");
        }, 2000);
      } else {
        const errorMessage = await response.json();
        if (errorMessage.application) {
          alert(errorMessage.application[0]);
        } else {
          setAlert({ severity: "error", message: errorMessage.student });
          console.error("Failed to create select-donor:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error creating select-donor:", error);
    }
  };

  return (
    <Container
      maxWidth="lg" // allow more room for 70% width
      sx={{ marginTop: 4 }}
    >
      <Box
        sx={{
          width: "80%",
          mx: "auto", // centers the box horizontally
          backgroundColor: "white",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          height: "500px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          SELECT MENTOR
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={12}>
              <TextField
                select
                label="Select Student"
                variant="outlined"
                name="student"
                value={formData.student}
                onChange={handleChange}
                fullWidth
                required
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.student_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                select
                label="Select Mentor"
                variant="outlined"
                name="mentor"
                value={formData.mentor}
                onChange={handleChange}
                fullWidth
                required
              >
                {mentors.map((mentor) => (
                  <MenuItem key={mentor.id} value={mentor.id}>
                    {mentor.mentor_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12}>
              <InputLabel shrink>Date Since Mentor Assigned</InputLabel>
              <TextField
                type="date"
                variant="outlined"
                name="selection_date"
                value={formData.selection_date}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Box mt={6} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#14475a" }}
              onClick={handleSubmit}
            >
              SUBMIT
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1fb8c3" }}
              onClick={handleAddMentorClick}
            >
              Add Mentor
            </Button>
          </Box>
        </form>
      </Box>

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
    </Container>
  );
};

export default CreateSelectMentorForm;
