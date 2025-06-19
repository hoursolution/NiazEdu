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

const ViewInterviewDetails = ({ viewHousehold }) => {
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

        <form>
          <Grid container spacing={4} sx={{ marginTop: 0.5 }}>
            <Grid item xs={12} sm={12}>
              {" "}
              <TextField
                name="interviewer_recommendation"
                label="Interviewer Reccomandation"
                fullWidth
                multiline
                rows={5} // You can increase this number if needed
                value={viewHousehold ? viewHousehold : "no reccomandation"}
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

export default ViewInterviewDetails;
