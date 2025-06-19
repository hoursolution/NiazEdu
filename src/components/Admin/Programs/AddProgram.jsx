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
import { useNavigate } from "react-router-dom";

const CreateProgramForm = () => {
  const navigate = useNavigate();
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";
  const [formData, setFormData] = useState({
    name: "",
    program_type: "",
    duration_in_months: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/Programs/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (response.ok) {
        console.log("successfully created Program");
        navigate("/Admin/programs");
      } else {
        const errorMessage = await response.json();
        if (errorMessage.application) {
          alert(errorMessage.application[0]);
        } else {
          console.error("Failed to create Program:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error creating Program:", error);
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
          Add Program
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
              ADD
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProgramForm;
