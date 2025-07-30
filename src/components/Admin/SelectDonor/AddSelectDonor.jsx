import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  IconButton,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  DialogActions,
  Slide, // Import Slide for animations
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

// Define a transition component for Snackbar and Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateSelectDonorForm = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [donors, setDonors] = useState([]);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(null); // This state is declared but not used in the provided snippet
  const [fieldErrors, setFieldErrors] = useState({});
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const [donorStats, setDonorStats] = useState({
    total_paid: 0,
    total_sponsored: 0,
    remaining_to_allocate: 0,
    sponsored_students: 0,
  });

  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const [formData, setFormData] = useState({
    application: "",
    donor: "",
    selection_date: "",
    trigger_projection: "No",
    no_of_years: "",
    // The following fields were commented out in the original request for styling,
    // but are part of the formData state. They are kept here for functionality,
    // but their corresponding UI elements are removed as per the instruction
    // "the commented fields should be ignore".
    // no_of_semesters: "",
    // installments_per_semester: 1,
    // semester_duration: "1",

    // Monthly
    total_fee_of_the_program: "",
    transport_amount: "",

    // One-time
    admission_fee_of_the_program: "",
    other_amount: "",
    health_insurance: "",
    eid_al_adha_gift: "",
    eid_al_fitr_gift: "",
    birthday_gift: "",
    living_expenses: "", // Uniform Cost
    food_and_necessities_expenses: "", // Books & Supplies

    // Month Triggers
    eid_al_adha_month: "",
    eid_al_fitr_month: "",
  });

  const handleCloseAlert = () => setAlert(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If donor changed, fetch stats
    if (name === "donor") {
      try {
        const res = await fetch(`${BASE_URL}/api/donor-summary/${value}/`);
        if (res.ok) {
          const data = await res.json();
          setDonorStats(data);
        } else {
          setDonorStats({
            total_paid: 0,
            total_sponsored: 0,
            remaining_to_allocate: 0,
            sponsored_students: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching donor stats", err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, donorsRes, allSelectDonorsRes] = await Promise.all([
          fetch(`${BASE_URL}/all-applications/`),
          fetch(`${BASE_URL}/api/donor/`),
          fetch(`${BASE_URL}/api/select-donor/`),
        ]);

        const [applications, donors, allSelectDonors] = await Promise.all([
          studentsRes.json(),
          donorsRes.json(),
          allSelectDonorsRes.json(),
        ]);

        // Get assigned application IDs
        const assignedApplicationIds = allSelectDonors.map(
          (sd) => sd.application
        );

        // Filter out applications already assigned
        const unassignedApplications = applications.filter(
          (app) => !assignedApplicationIds.includes(app.id)
        );

        // Group applications by student full name
        const grouped = {};
        unassignedApplications.forEach((app) => {
          const key = `${app.name} ${app.last_name}`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(app);
        });

        // Sort each group and assign display name
        const groupedWithSortKey = Object.values(grouped).map((group) => {
          group.sort((a, b) => a.id - b.id);
          return {
            sortKey: group[0].id,
            items: group,
          };
        });

        groupedWithSortKey.sort((a, b) => a.sortKey - b.sortKey);

        const updatedData = [];
        groupedWithSortKey.forEach((group) => {
          group.items.forEach((app, index) => {
            const order = index + 1;
            const suffix = order === 1 ? "" : ` (${order})`;
            const displayName = `${app.name} ${app.last_name}${suffix}`;
            updatedData.push({
              ...app,
              displayNameWithOrder: displayName,
            });
          });
        });

        setStudents(updatedData);
        setDonors(donors);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Optionally set an error state to display to the user
        setAlert({
          severity: "error",
          message: "Failed to load data. Please try again later.",
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields if projection is Yes
    // Removed 'no_of_semesters', 'installments_per_semester', 'semester_duration'
    // from requiredFields as their UI elements are ignored.
    const requiredFields =
      formData.trigger_projection === "Yes"
        ? [
            "no_of_years",
            // "no_of_semesters", // Ignored as per instruction
            // "installments_per_semester", // Ignored as per instruction
            // "semester_duration", // Ignored as per instruction
          ]
        : [];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      const newErrors = {};
      missingFields.forEach((field) => {
        newErrors[field] = "This field is required";
      });
      setFieldErrors(newErrors);
      setAlert({
        severity: "error",
        message: "Please fill in all required fields for projection.",
      });
      return;
    }

    setFieldErrors({}); // Clear previous field errors
    try {
      console.log("Submitting form data:", formData);
      const response = await fetch(`${BASE_URL}/api/select-donor/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setAlert({
          severity: "success",
          message: "Donor successfully assigned to student!",
        });
        setTimeout(() => navigate("/Admin/selectDonor"), 2000);
      } else {
        const errorMessage = await response.json();
        setAlert({
          severity: "error",
          message: errorMessage.student || "Error occurred during assignment.",
        });
      }
    } catch (error) {
      console.error("Error creating select-donor:", error);
      setAlert({
        severity: "error",
        message: "Network error or server is unreachable.",
      });
    }
  };

  const handleInfoDialogOpen = () => {
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  const handleAddDonorClick = () => navigate("/Admin/createDonor");

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* cards*/}
      <Grid item xs={12} sx={{ width: "120%", marginBottom: "10px" }}>
        <Paper
          elevation={2}
          sx={{
            padding: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            marginTop: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: 600 }}
            variant="h5"
            gutterBottom
            textAlign="center"
          >
            Donor Financial Summary
          </Typography>
          <Grid
            container
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
            textAlign="center"
          >
            {[
              {
                label: "📌 Committed by Donor",
                value: donorStats.total_pledged,
                description: "Total amount the donor has pledged.",
                color: "green",
              },
              {
                label: "💸 Paid so far by Donor ",
                value: donorStats.total_paid,
                description: "Actual amount received so far.",
                color: "blue",
              },
              {
                label: "🎓 Sponsored To Students",
                value: donorStats.total_sponsored,
                description: "Total amount sponsored to students.",
                color: "orange",
              },
              {
                label: "📊 Balance for Sponsorship",
                value: donorStats.remaining_to_allocate,
                description: "Paid amount not yet allocated to students.",
                color: "red",
              },
              {
                label: "👨‍🎓 Students Sponsored by Donor",
                value: donorStats.sponsored_students,
                description: "Total number of students supported.",
                color: "teal",
              },
            ].map((item, index) => (
              <Grid item xs={6} sm={2} key={index}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="#5c5c5c">
                    {item.label}
                  </Typography>
                  <Typography variant="subtitle1" color={item.color}>
                    Rs: {item.value}
                  </Typography>
                  {/* <Typography variant="caption" color="textSecondary">
                    {item.description}
                  </Typography> */}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* form */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          marginBottom: "80px",
        }}
      >
        {/* Header */}
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Assign Donor to Student
            <IconButton
              onClick={handleInfoDialogOpen}
              sx={{ marginLeft: 1 }}
              color="primary"
            >
              <InfoIcon />
            </IconButton>
          </Typography>
        </Box>

        {/* Scrollable Form Area */}
        <Box
          sx={{
            paddingX: 3,
            paddingY: 1,
            flex: 1,
            overflowY: "auto", // This allows scroll only within the form area
            marginBottom: 4,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Student"
                  variant="outlined"
                  name="application"
                  value={formData.application}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2, // Rounded input fields
                      transition:
                        "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db", // Blue border on focus
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)", // Subtle shadow on focus
                      },
                      "&:hover fieldset": {
                        borderColor: "#5dade2", // Lighter blue on hover
                      },
                    },
                  }}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.displayNameWithOrder}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Donor"
                  variant="outlined"
                  name="donor"
                  value={formData.donor}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition:
                        "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#5dade2",
                      },
                    },
                  }}
                >
                  {donors.map((donor) => (
                    <MenuItem key={donor.id} value={donor.id}>
                      {donor.donor_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly Tuition Fee"
                  variant="outlined"
                  name="total_fee_of_the_program"
                  value={formData.total_fee_of_the_program}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }} // Ensure non-negative input
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly Transport Cost"
                  variant="outlined"
                  name="transport_amount"
                  value={formData.transport_amount}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Admission Fee"
                  variant="outlined"
                  name="admission_fee_of_the_program"
                  value={formData.admission_fee_of_the_program}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Other One-Time Amount"
                  variant="outlined"
                  name="other_amount"
                  value={formData.other_amount}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Health Insurance "
                  variant="outlined"
                  name="health_insurance"
                  value={formData.health_insurance}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Uniform Cost"
                  variant="outlined"
                  name="living_expenses"
                  value={formData.living_expenses}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Books & Supplies"
                  variant="outlined"
                  name="food_and_necessities_expenses"
                  value={formData.food_and_necessities_expenses}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Birthday Gift"
                  variant="outlined"
                  name="birthday_gift"
                  value={formData.birthday_gift}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Eid al-Fitr Gift"
                  variant="outlined"
                  name="eid_al_fitr_gift"
                  value={formData.eid_al_fitr_gift}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Eid al-Adha Gift"
                  variant="outlined"
                  name="eid_al_adha_gift"
                  value={formData.eid_al_adha_gift}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Eid al-Fitr Month"
                  variant="outlined"
                  name="eid_al_fitr_month"
                  value={formData.eid_al_fitr_month}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Eid al-Adha Month"
                  variant="outlined"
                  name="eid_al_adha_month"
                  value={formData.eid_al_adha_month}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": { borderColor: "#5dade2" },
                    },
                  }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* The following Grid items are commented out as per the instruction "the commented fields should be ignore" */}
              {/*
            <Grid item xs={12} sm={4}>
              <InputLabel shrink>
                No Of Semesters/Months <span>*</span>
              </InputLabel>
              <TextField
                variant="outlined"
                name="no_of_semesters"
                value={formData.no_of_semesters}
                onChange={handleChange}
                select
                fullWidth
                required={formData.trigger_projection === "Yes"}
                error={!!fieldErrors.no_of_semesters}
                helperText={fieldErrors.no_of_semesters}
              >
                {[...Array(12).keys()].map((i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel shrink>
                {formData.semester_duration === "1"
                  ? "Installments Per Month"
                  : "Installments Per Semester"}
              </InputLabel>
              <TextField
                variant="outlined"
                name="installments_per_semester"
                value={
                  formData.semester_duration === "1"
                    ? "1" // Auto-set to 1 when Month is selected
                    : formData.installments_per_semester
                }
                onChange={handleChange}
                fullWidth
                type="number"
                disabled={formData.semester_duration === "1"} // Disable when Month is selected
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Projection Duration"
                variant="outlined"
                name="semester_duration"
                value={formData.semester_duration}
                onChange={(e) => {
                  // Update semester_duration
                  handleChange(e);

                  // Auto-set installments to 1 when Month is selected
                  if (e.target.value === "1") {
                    setFormData((prev) => ({
                      ...prev,
                      installments_per_semester: "1",
                    }));
                  }
                }}
                fullWidth
                required
              >
                <MenuItem value="1">Monthly Projection</MenuItem>
                <MenuItem value="6">Semester Projection</MenuItem>
              </TextField>
            </Grid>
            */}

              <Grid item xs={12} sm={8}>
                <TextField
                  select
                  label="Generate auto Projection sheet"
                  variant="outlined"
                  name="trigger_projection"
                  value={formData.trigger_projection}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition:
                        "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#5dade2",
                      },
                    },
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={12}>
                <InputLabel
                  shrink
                  sx={{ fontWeight: 600, color: "#2c3e50", marginBottom: 0.5 }}
                >
                  No Of Years <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <TextField
                  variant="outlined"
                  name="no_of_years"
                  value={formData.no_of_years}
                  onChange={handleChange}
                  select
                  fullWidth
                  required={formData.trigger_projection === "Yes"}
                  error={!!fieldErrors.no_of_years}
                  helperText={fieldErrors.no_of_years}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition:
                        "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#5dade2",
                      },
                    },
                  }}
                >
                  {[1, 2, 3, 4, 5].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={12}>
                <InputLabel
                  shrink
                  sx={{ fontWeight: 600, color: "#2c3e50", marginBottom: 0.5 }}
                >
                  Start Date of Sponsorship
                </InputLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  name="selection_date"
                  value={formData.selection_date}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true, // Ensure label is always shrunk for date input
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition:
                        "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&.Mui-focused fieldset": {
                        borderColor: "#3498db",
                        boxShadow: "0 0 0 2px rgba(52, 152, 219, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#5dade2",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: 4 }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#28a745", // Modern green for primary action
                  color: "white",
                  padding: "12px 25px",
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(40, 167, 69, 0.2)",
                  transition:
                    "background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#218838", // Darker green on hover
                    transform: "translateY(-2px)", // Slight lift
                    boxShadow: "0 6px 15px rgba(40, 167, 69, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)", // Press down effect
                  },
                }}
              >
                Assign Donor
              </Button>
              <Button
                variant="contained"
                onClick={handleAddDonorClick}
                sx={{
                  backgroundColor: "#007bff", // Modern blue for secondary action
                  color: "white",
                  padding: "12px 25px",
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
                  transition:
                    "background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#0056b3", // Darker blue on hover
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0, 123, 255, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                Add New Donor
              </Button>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        TransitionComponent={Transition} // Apply slide transition
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position at bottom center
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity={alert?.severity}
          sx={{ borderRadius: 2 }} // Rounded corners for alert
        >
          {alert?.message}
        </MuiAlert>
      </Snackbar>

      <Dialog
        open={infoDialogOpen}
        onClose={handleInfoDialogClose}
        TransitionComponent={Transition} // Apply slide transition
        aria-labelledby="projection-info-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            padding: 2,
            maxWidth: 600,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", // Deeper shadow for dialog
          },
        }}
      >
        <DialogTitle
          id="projection-info-dialog-title"
          sx={{
            fontWeight: 700,
            fontSize: "1.8rem", // Larger title
            color: "#1A1A1A",
            borderBottom: "1px solid #eee", // Subtle separator
            paddingBottom: 2,
            marginBottom: 2,
          }}
        >
          How Projection Generation Works
        </DialogTitle>

        <DialogContent sx={{ padding: 3 }}>
          <Typography
            variant="body1"
            sx={{ color: "#4A4A4A", lineHeight: 1.7, mb: 3 }}
          >
            This feature auto-generates a monthly financial projection sheet
            based on your provided costs. The system uses your inputs to build a
            clear payment plan across the academic period.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1A1A1A", mb: 1 }}
            >
              Core Inputs
            </Typography>
            <Box
              component="ul"
              sx={{ pl: 2, color: "#4A4A4A", lineHeight: 1.6 }}
            >
              <li>
                <strong>Application</strong>: Links the donor support to a
                student’s application.
              </li>
              <li>
                <strong>Donor</strong>: The person or organization funding the
                support.
              </li>
              <li>
                <strong>No. of Years</strong>: Total academic duration (used to
                calculate months).
              </li>
              <li>
                <strong>Start Date</strong>: The date classes begin — sets the
                timeline base.
              </li>
              <li>
                <strong>Monthly Costs</strong>: Includes tuition and transport
                paid every month.
              </li>
              <li>
                <strong>One-Time Costs</strong>: Special payments like
                admission, health, Eid, birthday, etc.
              </li>
              <li>
                <strong>Trigger Projection</strong>: If set to "Yes",
                projections are generated immediately.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1A1A1A", mb: 1 }}
            >
              Monthly Logic
            </Typography>
            <Box
              component="ul"
              sx={{ pl: 2, color: "#4A4A4A", lineHeight: 1.6 }}
            >
              <li>
                Projections are created for every month over the program’s
                duration.
              </li>
              <li>Tuition and transport are repeated monthly.</li>
              <li>
                <strong>Admission Fee</strong> and{" "}
                <strong>Other One-Time Cost</strong> are added only in the 1st
                month.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1A1A1A", mb: 1 }}
            >
              Special Month Triggers
            </Typography>
            <Box
              component="ul"
              sx={{ pl: 2, color: "#4A4A4A", lineHeight: 1.6 }}
            >
              <li>
                <strong>Health Insurance, Uniform, and Supplies</strong> — added
                only in the 1st month.
              </li>
              <li>
                <strong>Eid Gifts</strong> — added only in the selected Eid
                months (1–12).
              </li>
              <li>
                <strong>Birthday Gift</strong> — added in the month matching the
                student’s birth month.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1A1A1A", mb: 1 }}
            >
              Good to Know
            </Typography>
            <Box
              component="ul"
              sx={{ pl: 2, color: "#4A4A4A", lineHeight: 1.6 }}
            >
              <li>
                Each month's projection includes comments showing added one-time
                items.
              </li>
              <li>
                Projections are automatically recalculated if updated and
                resubmitted with "Yes".
              </li>
              <li>Only fixed amounts are used — no percentage calculations.</li>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: "#6B7280", fontStyle: "italic", mt: 2 }}
          >
            Pro Tip: Keep Eid and birthday months in mind for accurate gift
            scheduling.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{ padding: 2, borderTop: "1px solid #eee", paddingTop: 2 }}
        >
          <Button
            onClick={handleInfoDialogClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#3B82F6",
              padding: "10px 20px",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
              transition:
                "background-color 0.3s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#2563EB",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              },
            }}
          >
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateSelectDonorForm;
