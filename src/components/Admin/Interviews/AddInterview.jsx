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
  Typography,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateInterviewForm = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [applicationId, setApplicationId] = useState(0);
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";
  const [formData, setFormData] = useState({
    application: null,
    interviewer_name: "",
    interview_date: "",
    question_1: "",
    question_2: "",
    question_3: "",
    question_4: "",
    question_5: "",
    question_6: "",
    question_7: "",
    question_8: "",
    question_9: "",
    question_10: "",
    question_11: "",
    question_12: "",
    interviewer_recommendation: "",
    Accepted: "-",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/verifications/`).then((res) => res.json()),
      fetch(`${BASE_URL}/api/interviews/`).then((res) => res.json()),
      fetch(`${BASE_URL}/all-applications/`).then((res) => res.json()),
    ])
      .then(([verifications, interviews, applications]) => {
        // Get all application IDs that already have interviews
        const interviewedAppIds = new Set(
          interviews.map((i) => i.application?.id)
        );

        // Get application IDs where move_for_interview === "yes"
        const moveForInterviewAppIds = new Set(
          verifications
            .filter(
              (v) =>
                v.move_for_interview === "yes" &&
                v.application?.status === "Accepted"
            )
            .map((v) => v.application.id)
        );

        // Final list: in moveForInterview list and NOT already interviewed
        const filteredApplications = applications.filter(
          (app) =>
            moveForInterviewAppIds.has(app.id) && !interviewedAppIds.has(app.id)
        );

        setApplications(filteredApplications);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/interview/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (response.ok) {
        console.log("successfully created interview");
        navigate("/Admin/allInterviews");
      } else {
        const errorMessage = await response.json();
        if (errorMessage.application) {
          alert(errorMessage.application[0]);
        } else {
          console.error("Failed to create interview:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error creating interview:", error);
    }
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
  const validateForm = (formData) => {
    const errors = {};

    // Check if the application field is selected
    if (!formData.application) {
      errors.application = "Please select an application";
    }

    // Validate interviewer name
    if (!formData.interviewer_name.trim()) {
      errors.interviewer_name = "Interviewer name is required";
    }

    // Validate interview date
    if (!formData.interview_date) {
      errors.interview_date = "Interview date is required";
    }

    // Add validation for each question
    for (let i = 1; i <= 11; i++) {
      const questionName = `question_${i}`;
      if (!formData[questionName].trim()) {
        errors[questionName] = `Question ${i} is required`;
      }
    }

    // Validate interviewer recommendation
    if (!formData.interviewer_recommendation.trim()) {
      errors.interviewer_recommendation =
        "Interviewer recommendation is required";
    }

    // Validate Accepted field
    if (formData.Accepted === "-") {
      errors.Accepted =
        "Please select whether the interview was accepted or not";
    }

    return errors;
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: 2,
      }}
    >
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ADD INTERVIEW
        </Typography>
        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: {
                backgroundColor: "black", // Change this to the desired color
              },
            }}
            sx={{
              marginTop: 1,
            }}
          >
            <Tab
              label="Interview Information"
              sx={{
                backgroundColor: activeTab === 0 ? "#DCD7D7" : "#12b4bf",
                borderTopLeftRadius: "5px",
                // color: "white",
              }}
            />
            <Tab
              label="Questions"
              sx={{
                backgroundColor: activeTab === 1 ? "#DCD7D7" : "#12b4bf",
              }}
            />
            <Tab
              label="Other Information"
              sx={{
                backgroundColor: activeTab === 2 ? "#DCD7D7" : "#12b4bf",
                // color: "white",
              }}
            />
          </Tabs>
          {activeTab === 0 && (
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Application"
                  variant="outlined"
                  name="application"
                  value={formData.application}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.application}
                  helperText={formErrors.application}
                >
                  {applications.map((application) => (
                    <MenuItem key={application.id} value={application.id}>
                      {application.name} {application.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Interviewer Name"
                  variant="outlined"
                  name="interviewer_name"
                  value={formData.interviewer_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.interviewer_name}
                  helperText={
                    formErrors.interviewer_name && formErrors.interviewer_name
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Interview Date</InputLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  name="interview_date"
                  value={formData.interview_date}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.interview_date}
                  helperText={formErrors.interview_date}
                />
              </Grid>
            </Grid>
          )}
          {activeTab === 1 && (
            <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel>Ask about student profile *</InputLabel>
                  <TextField
                    // label="Question 1"
                    variant="outlined"
                    name="question_1"
                    multiline
                    rows={3}
                    value={formData.question_1}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_1}
                    helperText={formErrors.question_1}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Ask student's family background and analyze financial
                    circumstances *
                  </InputLabel>
                  <TextField
                    // label="Question 2"
                    variant="outlined"
                    name="question_2"
                    multiline
                    rows={3}
                    value={formData.question_2}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_2}
                    helperText={formErrors.question_2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Ask about student's career plans and future aspirations
                    regarding studies or career *
                  </InputLabel>
                  <TextField
                    // label="Question 3"
                    variant="outlined"
                    name="question_3"
                    multiline
                    rows={3}
                    value={formData.question_3}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_3}
                    helperText={formErrors.question_3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    How was education being financed till now? *
                  </InputLabel>
                  <TextField
                    // label="Question 4"
                    variant="outlined"
                    name="question_4"
                    multiline
                    rows={3}
                    value={formData.question_4}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_4}
                    helperText={formErrors.question_4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    How much financial support is required and what amount will
                    be student contribution *
                  </InputLabel>
                  <TextField
                    // label="Question 5"
                    variant="outlined"
                    name="question_5"
                    multiline
                    rows={3}
                    value={formData.question_5}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_5}
                    helperText={formErrors.question_5}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    For how long will the financial support be required? *
                  </InputLabel>
                  <TextField
                    // label="Question 6"
                    variant="outlined"
                    name="question_6"
                    multiline
                    rows={3}
                    value={formData.question_6}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_6}
                    helperText={formErrors.question_6}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Ask student if he/she was planning to manage his/her
                    studies, especially if they have already started a program?
                    *
                  </InputLabel>
                  <TextField
                    // label="Question 7"
                    variant="outlined"
                    name="question_7"
                    multiline
                    rows={3}
                    value={formData.question_7}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_7}
                    helperText={formErrors.question_7}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Why does the student feel he/she deserves this sponsorship?
                    *
                  </InputLabel>
                  <TextField
                    // label="Question 8"
                    variant="outlined"
                    name="question_8"
                    multiline
                    rows={3}
                    value={formData.question_8}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_8}
                    helperText={formErrors.question_8}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    What are the student's plans for self-sufficiency or
                    increase in contribution in the future? *
                  </InputLabel>
                  <TextField
                    // label="Question 9"
                    variant="outlined"
                    name="question_9"
                    multiline
                    rows={3}
                    value={formData.question_9}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_9}
                    helperText={formErrors.question_9}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Summary of responses to any other question that the
                    interview raised during the interview *
                  </InputLabel>
                  <TextField
                    // label="Question 10"
                    variant="outlined"
                    name="question_10"
                    multiline
                    rows={3}
                    value={formData.question_10}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_10}
                    helperText={formErrors.question_10}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Assess all the above with the personal statement included in
                    the application form and give recommendations for the case *
                  </InputLabel>
                  <TextField
                    // label="Question 11"
                    variant="outlined"
                    name="question_11"
                    multiline
                    rows={3}
                    value={formData.question_11}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_11}
                    helperText={formErrors.question_11}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>
                    Tell us about your involvement in volunteer work and
                    extracurricular activities *
                  </InputLabel>
                  <TextField
                    // label="Question 11"
                    variant="outlined"
                    name="question_12"
                    multiline
                    rows={3}
                    value={formData.question_12}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.question_12}
                    helperText={formErrors.question_12}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Add fields for other interview questions */}
          {activeTab === 2 && (
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Interviewer Recommendation"
                  variant="outlined"
                  name="interviewer_recommendation"
                  multiline
                  rows={3}
                  value={formData.interviewer_recommendation}
                  onChange={handleChange}
                  fullWidth
                  error={!!formErrors.interviewer_recommendation}
                  helperText={formErrors.interviewer_recommendation}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Accepted"
                  variant="outlined"
                  name="Accepted"
                  value={formData.Accepted}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.Accepted}
                  helperText={formErrors.Accepted}
                >
                  <MenuItem value="-">-</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
          <div
            style={{ marginTop: "20px", display: "flex", alignContent: "end" }}
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
            <Button
              variant="contained"
              // color="primary"
              sx={{ backgroundColor: "#14475a" }}
              disabled={activeTab === 2} // Adjust the upper limit based on the number of tabs
              onClick={handleContinue}
              style={{ marginLeft: "10px" }}
            >
              Continue
            </Button>
            {activeTab === 2 && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginLeft: "10px" }}
                sx={{ backgroundColor: "#14475a" }}
              >
                Create Interview
              </Button>
            )}
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateInterviewForm;
