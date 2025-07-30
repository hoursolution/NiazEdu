import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  InputLabel,
  Container,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProjectionForm = () => {
  const { ProjectionsId } = useParams();
  const navigate = useNavigate(); // Initialize the navigate object
  const BASE_URL = "http://127.0.0.1:8000";
  // const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [formData, setFormData] = useState({
    student: "",
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

  useEffect(() => {
    // Fetch projection data and set the form data
    const fetchProjectionData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/projections/${ProjectionsId}/`
        );
        if (response.ok) {
          const projectionData = await response.json();
          setFormData(projectionData);
        } else {
          console.error("Failed to fetch projection data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProjectionData();
  }, [ProjectionsId]);

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
    if (files.length > 0) {
      // If a file is uploaded, set it in the form data
      // Check if the file is for results or other_documents
      if (name === "results") {
        setFormData({ ...formData, results: files[0] });
      } else if (name === "other_documents") {
        setFormData({ ...formData, other_documents: files[0] });
      } else {
        // For other file inputs like challan and reciept
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      // If no file is uploaded, keep the existing URL in the form data
      setFormData({ ...formData, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (let key in formData) {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key] !== null && typeof formData[key] !== "string") {
        // If the value is not a string (i.e., it's a File object), append it directly
        formDataToSend.append(key, formData[key]);
      } else if (
        formData[key] !== null &&
        key !== "challan" &&
        key !== "reciept"
      ) {
        // If the value is not null and it's not the 'challan' or 'receipt' key, append it
        formDataToSend.append(key, formData[key]);
      }
      // Convert empty or 'NaN' sponsor_commitment2 and sponsor_percent2 to 0
      if (key === "sponsor_commitment2" || key === "sponsor_percent2") {
        if (formData[key] === "" || formData[key] === "NaN") {
          formDataToSend.append(key, "0");
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/projections/${ProjectionsId}/`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Projection updated successfully");
        navigate(-1);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to update projection:", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 2,
      }}
    >
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          EDIT PROJECTIONS
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={3}>
              {/* <InputLabel shrink>Student</InputLabel> */}
              <InputLabel
                shrink
                sx={{
                  fontWeight: "bold",
                }}
              >
                Student
              </InputLabel>
              <TextField
                select
                // label="Select Student"
                variant="outlined"
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                fullWidth
                size="small"
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.student_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
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
            {/* <Grid item xs={1} sx={{ marginTop: 3.9 }}>
              <Button
                onClick={toggleSponsorTwoFields}
                variant="contained"
                color="primary"
              >
                {showSponsorTwoFields ? "-" : "+"}
              </Button>
            </Grid> */}

            {/* Sponsor two detail fields */}

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
                fullWidth
                size="small"
              ></TextField>
            </Grid>
            <Grid item xs={12} md={4}>
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
                // label="Payment Date"
                type="date"
                value={formData.payment_date}
                onChange={handleInputChange}
                size="small"

                // fullWidth
              />
            </Grid>
            {/* <Grid item xs={12} md={2}>
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
                size="small"
                fullWidth
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </TextField>
            </Grid> */}
            {/* Add more input fields for other projection properties */}
            <Grid item xs={12} md={3}>
              <InputLabel>Update challan</InputLabel>
              <input
                type="file"
                name="challan"
                accept=".jpeg, .jpg, .png"
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <InputLabel>Update Receipt</InputLabel>
              <input
                type="file"
                name="reciept"
                accept=".jpeg, .jpg, .png"
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <InputLabel>Update Result</InputLabel>
              <input
                type="file"
                name="results"
                accept=".jpeg, .jpg, .png"
                onChange={handleFileChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <InputLabel>Update Other Document</InputLabel>
              <input
                type="file"
                name="other_documents"
                accept=".jpeg, .jpg, .png"
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="body1"
                sx={{
                  color: formData.challan ? "blue" : "red",
                }}
              >
                <a
                  href={formData.challan}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.challan
                    ? "View Existing Challan"
                    : "No existing challan"}
                </a>
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="body1"
                sx={{
                  color: formData.reciept ? "blue" : "red",
                }}
              >
                <a
                  href={formData.reciept}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.reciept
                    ? "View Existing Receipt"
                    : "No existing receipt"}
                </a>
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="body1"
                sx={{
                  color:
                    formData.results && formData.results.result
                      ? "blue"
                      : "red",
                }}
              >
                <a
                  href={formData.results && formData.results.result}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Existing results
                  {/* {formData.results && formData.results.result
                    ? "View Existing results"
                    : "No existing results"} */}
                </a>
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="body1"
                sx={{
                  color:
                    formData.other_documents &&
                    formData.other_documents.documents
                      ? "blue"
                      : "red",
                }}
              >
                <a
                  href={
                    formData.other_documents &&
                    formData.other_documents.documents
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Existing other document
                </a>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Update Projection
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateProjectionForm;
