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
  TextareaAutosize,
  Dialog,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const ViewReports = ({ viewHousehold, viewPersonalDetails }) => {
  const navigate = useNavigate();
  const [students, setstudents] = useState([]);
  const [alert, setAlert] = useState(null);
  const handleCloseAlert = () => {
    setAlert(null);
  };
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
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
    <Container sx={{ marginTop: 4, minWidth: "100%", paddingBottom: 4 }}>
      <Box
        sx={{
          width: "100%",
          mx: "auto", // centers the box horizontally
          my: "auto",
          backgroundColor: "white",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            variant: "h4",
            fontWeight: 700,
            className: "text-sky-950",
            align: "center",
          }}
        >
          View Details
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} sx={{ marginTop: 0.5 }}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="description_of_household"
                label="Household Description"
                fullWidth
                multiline
                rows={4} // You can increase this number if needed
                value={viewHousehold}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              {" "}
              <TextField
                name="personal_statement"
                label="Personal Statement"
                fullWidth
                multiline
                rows={5} // You can increase this number if needed
                value={viewPersonalDetails}
              />
            </Grid>
          </Grid>
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

export default ViewReports;
