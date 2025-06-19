import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  InputLabel,
  Paper,
  Container,
  InputAdornment,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AddProjectionForm = ({ studentId, refreshProjections }) => {
  // const { studentId } = useParams();
  const [alert, setAlert] = useState(null);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [showSponsorTwoFields, setShowSponsorTwoFields] = useState(false); // State variable to track whether sponsor two fields should be displayed

  const toggleSponsorTwoFields = () => {
    setShowSponsorTwoFields(!showSponsorTwoFields);
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  const [formData, setFormData] = useState({
    student: studentId,
    semester: "",
    tuition_fee: "",
    other_fee: "",
    total_cost: "",
    sponsor_name1: "",
    sponsor_commitment1: "",
    sponsor_percent1: "",
    sponsor_name2: "",
    sponsor_commitment2: "",
    sponsor_percent2: "",
    fee_due_date: "",
    payment_date: "",
    comments: "",
    status: "",
    challan: null,
    reciept: null,
    results: null,
    other_documents: null,
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);
  const [sponsor1Error, setSponsor1Error] = useState(false);
  const [sponsor2Error, setSponsor2Error] = useState(false);
  const [exceedingError, setExceedingError] = useState(false);
  const [totalCommitmentError, setTotalCommitmentError] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Calculate total commitments and percentages using the updated form data
    const tuitionFee =
      name === "tuition_fee"
        ? parseFloat(value)
        : parseFloat(formData.tuition_fee || 0);
    const otherFee =
      name === "other_fee"
        ? parseFloat(value)
        : parseFloat(formData.other_fee || 0);
    const totalCost = tuitionFee + otherFee;

    let sponsor1Value = parseFloat(formData.sponsor_commitment1 || 0);
    let sponsor2Value = parseFloat(formData.sponsor_commitment2 || 0);

    if (name === "sponsor_commitment1" || name === "sponsor_percent1") {
      sponsor1Value =
        name === "sponsor_commitment1"
          ? parseInt(value)
          : Math.round((parseInt(value) / 100) * totalCost);
    } else if (name === "sponsor_commitment2" || name === "sponsor_percent2") {
      sponsor2Value =
        name === "sponsor_commitment2"
          ? parseInt(value)
          : Math.round((parseInt(value) / 100) * totalCost);
    }

    // Calculate total commitments
    const totalCommitment = sponsor1Value + sponsor2Value;

    // Check if total commitment exceeds total cost
    if (totalCommitment > totalCost) {
      // Set error state
      setTotalCommitmentError(true);
    } else {
      // Clear error state
      setTotalCommitmentError(false);

      // Update form data with calculated values
      setFormData((prevData) => ({
        ...prevData,
        sponsor_commitment1: sponsor1Value.toString(),
        sponsor_commitment2: sponsor2Value.toString(),
        sponsor_percent1: Math.round(
          (sponsor1Value / totalCost) * 100
        ).toString(),
        sponsor_percent2: Math.round(
          (sponsor2Value / totalCost) * 100
        ).toString(),
        total_cost: totalCost.toFixed(2),
      }));
    }

    // Individual commitment validation
    const sponsor1Percent = parseFloat(formData.sponsor_percent1 || 0);
    const sponsor2Percent = parseFloat(formData.sponsor_percent2 || 0);

    const exceedingError =
      sponsor1Value > totalCost ||
      sponsor2Value > totalCost ||
      sponsor1Percent > 100 ||
      sponsor2Percent > 100;

    // Set or clear error state accordingly
    setExceedingError(exceedingError && sponsor1Value !== tuitionFee);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    // If files are present, set the first file in the form data; otherwise, set it to null
    setFormData({ ...formData, [name]: files.length > 0 ? files[0] : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (let key in formData) {
      // Check if the value is a File object and append it only if it exists
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key] !== null && typeof formData[key] !== "string") {
        // If the value is not a string (i.e., it's a File object), append it directly
        formDataToSend.append(key, formData[key]);
      } else if (formData[key] !== null) {
        // If the value is not null and it's not a file, append it
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${BASE_URL}/api/projections/`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        refreshProjections();

        console.log("Projection added successfully");
        setFormData({
          student: studentId,
          semester: "",
          tuition_fee: "",
          other_fee: "",
          total_cost: "",
          sponsor_name1: "",
          sponsor_commitment1: "",
          sponsor_percent1: "",
          sponsor_name2: "",
          sponsor_commitment2: "",
          sponsor_percent2: "",
          comments: "",
          fee_due_date: "",
          payment_date: "",
          status: "",
          challan: null,
          reciept: null,
          results: null,
          other_documents: null,
        });
        setAlert({
          severity: "success",
          message: "Projection Created successfully!",
        });
        setTimeout(() => {
          navigate(-1);
        }, 2000); // Reset form data after successful submission
      } else {
        const errorMessage = await response.text(); // Get the error message from the response body
        console.error("Failed to add projection:", errorMessage);
        if (error.response && error.response.data) {
          // Username already exists error
          const errorMessage = error.response.data;
          setAlert({ severity: "error", message: errorMessage });
        } else {
          // Other errors
          setAlert({
            severity: "error",
            message: "Failed to Created Projection",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Paper elevation={3} style={{ padding: 8, marginTop: 2, width: "99%" }}>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            // justifyContent="center"
            spacing={0.5}
            sx={{ marginTop: 1 }}
          >
            <Grid item xs={3}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Semester / Month
              </InputLabel>
              <TextField
                name="semester"
                // label="Semester"
                type="number"
                value={formData.semester}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Tuition Fee
              </InputLabel>
              <TextField
                name="tuition_fee"
                // label="Tuition Fee"
                type="number"
                value={formData.tuition_fee}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">RS</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Other Fee
              </InputLabel>
              <TextField
                name="other_fee"
                // label="Other Fee"
                type="number"
                value={formData.other_fee}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">RS</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Total Fee
              </InputLabel>
              <TextField
                name="total_cost"
                // label="Total Fee"
                type="number"
                value={formData.total_cost}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">RS</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Sponsor Name
              </InputLabel>
              <TextField
                name="sponsor_name1"
                type="text"
                value={formData.sponsor_name1}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Sponsorship Commitment
              </InputLabel>
              <TextField
                name="sponsor_commitment1"
                type="number"
                value={formData.sponsor_commitment1}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                error={totalCommitmentError || exceedingError}
                helperText={
                  totalCommitmentError
                    ? "Total commitment exceeds total cost"
                    : exceedingError
                    ? "Commitment or percentage exceeds tuition fee or 100%"
                    : ""
                } // Display error message
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">RS</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Sponsor Percent
              </InputLabel>
              <TextField
                name="sponsor_percent1"
                type="number"
                value={formData.sponsor_percent1}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                error={sponsor1Error} // Apply error state
                helperText={
                  sponsor1Error
                    ? "Sponsor commitment cannot exceed total fee"
                    : ""
                } // Display error message
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* Button to toggle display of sponsor two fields */}
            <Grid item xs={1} sx={{ marginTop: 3.9 }}>
              <Button
                onClick={toggleSponsorTwoFields}
                variant="contained"
                color="primary"
              >
                {showSponsorTwoFields ? "-" : "+"}
              </Button>
            </Grid>

            {/* Sponsor two detail fields */}
            {showSponsorTwoFields && (
              <>
                <Grid item xs={3} sx={{ marginTop: 1 }}>
                  <InputLabel
                    shrink
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Second Sponsor Name
                  </InputLabel>
                  <TextField
                    name="sponsor_name2"
                    type="text"
                    value={formData.sponsor_name2}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={3} sx={{ marginTop: 1 }}>
                  <InputLabel
                    shrink
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Second Sponsorship Commitment
                  </InputLabel>
                  <TextField
                    name="sponsor_commitment2"
                    type="number"
                    value={formData.sponsor_commitment2}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                    error={totalCommitmentError || exceedingError}
                    helperText={
                      totalCommitmentError
                        ? "Total commitment exceeds total cost"
                        : exceedingError
                        ? "Commitment or percentage exceeds tuition fee or 100%"
                        : ""
                    } // Display error message
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">RS</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={3} sx={{ marginTop: 1 }}>
                  <InputLabel
                    shrink
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Second Sponsor Percent
                  </InputLabel>
                  <TextField
                    name="sponsor_percent2"
                    type="number"
                    value={formData.sponsor_percent2}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                    error={sponsor2Error} // Apply error state
                    helperText={
                      sponsor2Error
                        ? "Sponsor commitment cannot exceed total fee"
                        : ""
                    } // Display error message
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Fee Due Date
              </InputLabel>
              <TextField
                name="fee_due_date"
                type="date"
                value={formData.fee_due_date}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Payment Date
              </InputLabel>
              <TextField
                name="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Status
              </InputLabel>
              <TextField
                name="status"
                // label="Status"
                select
                value={formData.status}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3} sx={{ marginTop: 1 }}>
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Comment
              </InputLabel>
              <TextField
                name="comments"
                // label="Status"

                value={formData.comments}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              ></TextField>
            </Grid>
            {/* Add more input fields for other projection properties */}
            <Grid
              container
              // justifyContent="center"
              spacing={1}
              sx={{ marginTop: 1, marginBottom: 2 }}
            >
              <Grid item xs={2.5}>
                <InputLabel
                  shrink
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Challan
                </InputLabel>
                <input
                  type="file"
                  // accept="application/pdf"
                  name="challan"
                  onChange={handleFileChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={2.5}>
                <InputLabel
                  shrink
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Receipt
                </InputLabel>
                <input
                  type="file"
                  // accept="application/pdf"
                  name="reciept"
                  onChange={handleFileChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={2.3}>
                <InputLabel
                  shrink
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Result
                </InputLabel>
                <input
                  type="file"
                  // accept="application/pdf"
                  accept=".jpeg, .jpg, .png"
                  name="results"
                  onChange={handleFileChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={2.3}>
                <InputLabel
                  shrink
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Other Documents
                </InputLabel>
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png"
                  // accept="application/pdf"
                  name="other_documents"
                  onChange={handleFileChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  sx={{
                    marginTop: 2,
                    marginLeft: 4,
                  }}
                  type="submit"
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={
                    sponsor1Error || sponsor2Error || totalCommitmentError
                  }
                >
                  Add Projection
                </Button>
              </Grid>
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
    </>
  );
};

export default AddProjectionForm;
