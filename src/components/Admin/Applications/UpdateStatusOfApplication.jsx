import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tab,
  Tabs,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Input,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const UpdateStatusOfApplicationForm = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const { applicationId } = useParams();
  const [degreeData, setDegreeData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState(null);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const handleCloseAlert = () => {
    setAlert(null);
  };
  const paperStyle = {
    padding: "20px",
    marginBottom: "20px",
  };

  const formFieldStyle = {
    marginBottom: "8px",
    Width: "200px",
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleBack = () => {
    setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
  };

  const handleContinue = () => {
    setActiveTab((prevTab) => Math.min(prevTab + 1, 8)); // Adjust the upper limit based on the number of tabs
  };

  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Fetch projection data and set the form data
    const fetchApplicationData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/application/${applicationId}/`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error("Failed to fetch application data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchApplicationData();
  }, []);
  const [existingData, setExistingData] = useState(null);
  // Function to fetch existing data from the API
  const fetchExistingData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/application/${applicationId}/`
      );
      setExistingData(response.data);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  // Call fetchExistingData when the component mounts to fetch existing data
  useEffect(() => {
    fetchExistingData();
  }, []);

  const [formData, setFormData] = useState({
    status: "",
    verification_required: false,
  });

  const handleChange = (event, index, type) => {
    const { name, type: fieldType, checked, files } = event.target;

    // If the event target is a checkbox, use the 'checked' value
    const newValue =
      fieldType === "checkbox"
        ? checked
        : fieldType === "file"
        ? files[0]
        : event.target.value;

    // Convert empty strings or strings containing "null" to null
    const sanitizedValue =
      newValue === "" || newValue === "null" ? null : newValue;

    // Convert null values to 0 for fields that require numbers
    const finalValue =
      typeof sanitizedValue === "number" ? sanitizedValue : sanitizedValue || 0;

    if (type === "degree") {
      // If type is 'degree', update the degree object at the specified index
      const updatedDegree = {
        ...formData.degree[index],
        [name]: finalValue,
      };

      const updatedFormData = {
        ...formData,
        degree: [
          ...formData.degree.slice(0, index), // Update the degree object at the specified index
          updatedDegree,
          ...formData.degree.slice(index + 1),
        ],
      };

      setFormData(updatedFormData);
    } else {
      // If type is not 'degree', update the main form data
      const updatedFormData = {
        ...formData,
        [name]: finalValue,
      };

      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData();
      const skipIfEmpty = [
        "email",
        "health_insurance",
        "eid_al_adha_gift",
        "eid_al_fitr_gift",
        "birthday_gift",
      ];

      // Append all fields to the FormData object
      for (const key in formData) {
        // **If the key is in skipIfEmpty and its value is empty or null, skip it.**
        if (
          skipIfEmpty.includes(key) &&
          (formData[key] === "" || formData[key] === null)
        ) {
          continue;
        }

        if (key === "degree") {
          // Handle degree data separately
          formData[key].forEach((degree, index) => {
            for (const degreeKey in degree) {
              formDataToSend.append(
                `degree[${index}].${degreeKey}`,
                degree[degreeKey]
              );
            }
          });
        } else if (formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      }

      console.log("FormData to send:", formDataToSend);

      const response = await axios.put(
        `${BASE_URL}/api/applications/${existingData.id}/`,
        formDataToSend,
        applicationId
      );
      setAlert({
        severity: "success",
        message: "Application Status updated successfully!",
      });
      setTimeout(() => {
        navigate(-1);
      }, 2000); // Navigate after 2 seconds
      // Handle successful response
      console.log("Application updated successfully:", response.data);
    } catch (error) {
      // Handle error
      console.error("Error updating application:", error);
      console.log("Error response data:", error.response.data); // Log the response data from the server
      if (error.response && error.response.data) {
        // Username already exists error
        const errorMessage = error.response.data;
        setAlert({ severity: "error", message: errorMessage });
      } else {
        // Other errors
        setAlert({
          severity: "error",
          message: "Failed to update status of Application",
        });
      }
    }
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 2,
        }}
      >
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
          <Typography variant="h4" align="center" gutterBottom>
            UPDATE STATUS OF APPLICATION
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              marginTop: 1,
            }}
          >
            // Inside the return statement where Tabs are rendered
            <Tab
              label="Status & Verification"
              sx={{
                backgroundColor: "#12b4bf",
                // color: "black",
                borderTopRightRadius: "5px",
              }}
            />
          </Tabs>
          <Box sx={{ maxHeight: "150px" }}>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="mr-1 h-screen"
            >
              {activeTab === 0 && (
                <Paper style={paperStyle}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Status"
                        variant="outlined"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        fullWidth
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Accepted">Accepted</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.verification_required}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                verification_required: e.target.checked,
                              })
                            }
                            name="verification_required"
                          />
                        }
                        label="Verification Required"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <div
                style={{
                  marginTop: "0px",
                  display: "flex",
                  alignContent: "end",
                }}
              >
                <Button
                  variant="contained"
                  // color="primary"
                  disabled={activeTab === 0}
                  sx={{ backgroundColor: "#14475a" }}
                  onClick={handleBack}
                >
                  Back
                </Button>

                {activeTab === 0 && (
                  <Button
                    type="submit"
                    variant="contained"
                    // color="primary"
                    style={{ marginLeft: "10px" }}
                    sx={{ backgroundColor: "#14475a" }}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
            /
          </Box>
        </Paper>
      </Container>
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
    </>
  );
};

export default UpdateStatusOfApplicationForm;
