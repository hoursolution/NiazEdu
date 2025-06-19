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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EditProgramForm = () => {
  const navigate = useNavigate();
  const { ProgramId } = useParams();
  // const BASE_URL = "http://127.0.0.1:8000"
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [formData, setFormData] = useState({
    name: "",
    program_type: "",
    duration_in_months: "",
  });
  useEffect(() => {
    // Fetch interview data for editing
    fetch(`${BASE_URL}/api/Programs/${ProgramId}/`) // Assuming your API endpoint for fetching interview data by ID is provided
      .then((response) => response.json())
      .then((data) => {
        setFormData(data); // Set form data with the fetched interview data
      })
      .catch((error) => {
        console.error("Error fetching select-donor data:", error);
      });
  }, [ProgramId]); // Add id to dependencies array to re-fetch interview data when ID changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const errors = validateForm(formData);
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    //   return;
    // }
    try {
      const response = await fetch(
        `${BASE_URL}/api/Programs/${ProgramId}/`, // Assuming your API endpoint for updating Selcted donor data by ID is provided
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        console.log("Successfully updated programs");
        navigate("/Admin/programs");
      } else {
        const errorMessage = await response.json();
        if (errorMessage.application) {
          alert(errorMessage.application[0]);
        } else {
          console.error("Failed to update programs:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error updating programs:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        paddingTop: 5,
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
          Edit Program
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              ></TextField>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Program Type"
                variant="outlined"
                name="program_type"
                value={formData.program_type}
                onChange={handleChange}
                fullWidth
                required
                select
              >
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="semesters">Semesters</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12}>
              {/* <InputLabel shrink>Duration In Months</InputLabel> */}
              <TextField
                type="number"
                label="Duration In Months"
                variant="outlined"
                name="duration_in_months"
                value={formData.duration_in_months}
                onChange={handleChange}
                fullWidth
                required
                // error={!!formErrors.selection_date}
                // helperText={formErrors.selection_date}
              />
            </Grid>
          </Grid>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              // color="primary"
              sx={{ backgroundColor: "#14475a" }}
              onClick={handleSubmit}
              style={{ marginLeft: "10px" }}
            >
              Update
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProgramForm;
