import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  InputLabel,
  Container,
  Typography,
  Snackbar,
  SnackbarContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Slide, // Import Slide for animations
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

// Define a transition component for Snackbar and Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditSelectDonorForm = ({
  SelectDonorId,
  handleCloseDialog,
  handleEditSuccess,
}) => {
  const navigate = useNavigate();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [formData, setFormData] = useState({
    application: "",
    donor: "",
    selection_date: "",
    trigger_projection: "",
    no_of_years: "",
    // The following fields were commented out in the original request for styling,
    // but are part of the formData state. They are kept here for functionality,
    // but their corresponding UI elements are removed as per the instruction
    // "the commented fields should be ignore".
    semester_duration: "1",
    no_of_semesters: "",
    installments_per_semester: 1,

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
    living_expenses: "",
    food_and_necessities_expenses: "",

    // Month Triggers
    eid_al_adha_month: "",
    eid_al_fitr_month: "",
  });
  const [students, setStudents] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(SelectDonorId);
        setLoading(true);
        const [
          selectDonorResponse,
          allApplicationsResponse,
          donorsResponse,
          allSelectDonorsResponse,
        ] = await Promise.all([
          fetch(`${BASE_URL}/api/select-donor/${SelectDonorId}/`),
          fetch(`${BASE_URL}/all-applications/`),
          fetch(`${BASE_URL}/api/donor/`),
          fetch(`${BASE_URL}/api/select-donor/`),
        ]);

        if (
          !selectDonorResponse.ok ||
          !allApplicationsResponse.ok ||
          !donorsResponse.ok ||
          !allSelectDonorsResponse.ok
        ) {
          throw new Error("Failed to fetch one or more resources");
        }

        const [selectDonorData, applications, donorsData, allSelectDonors] =
          await Promise.all([
            selectDonorResponse.json(),
            allApplicationsResponse.json(),
            donorsResponse.json(),
            allSelectDonorsResponse.json(),
          ]);
        console.log(selectDonorData);
        const assignedApplicationIds = allSelectDonors
          .map((sd) => sd.application)
          .filter((id) => id !== selectDonorData.application);

        const unassignedApplications = applications.filter(
          (app) => !assignedApplicationIds.includes(app.id)
        );

        // Include current selected application even if already assigned
        const currentApplication = applications.find(
          (app) => app.id === selectDonorData.application
        );
        if (
          currentApplication &&
          !unassignedApplications.some(
            (app) => app.id === currentApplication.id
          )
        ) {
          unassignedApplications.unshift(currentApplication);
        }

        // Group by student name
        const grouped = {};
        unassignedApplications.forEach((app) => {
          const key = `${app.name} ${app.last_name}`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(app);
        });

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
          let order = 1;
          group.items.forEach((app) => {
            let suffix = "";
            if (app.id !== selectDonorData.application) {
              order++;
              suffix = ` (${order - 1})`;
            }
            const displayName =
              app.id === selectDonorData.application
                ? `${app.name} ${app.last_name}`
                : `${app.name} ${app.last_name}${suffix}`;

            updatedData.push({
              ...app,
              displayNameWithOrder: displayName,
            });
          });
        });

        setFormData((prevFormData) => ({
          ...selectDonorData,
          trigger_projection: "No", // Ensure this is set to No by default on load
        }));
        setStudents(updatedData); // 'students' here means 'applications' list
        setDonors(donorsData);
      } catch (error) {
        console.error("Error during API calls:", error.message);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [SelectDonorId]);

  useEffect(() => {
    setFieldErrors({});
  }, [formData.trigger_projection]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields if projection is Yes
    // Removed 'semester_duration', 'no_of_semesters', 'installments_per_semester'
    // from requiredFields as their UI elements are ignored.
    const requiredFields =
      formData.trigger_projection === "Yes"
        ? [
            "no_of_years",
            // "semester_duration", // Ignored as per instruction
            // "no_of_semesters", // Ignored as per instruction
            // "installments_per_semester", // Ignored as per instruction
          ]
        : [];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      const newErrors = {};
      missingFields.forEach((field) => {
        newErrors[field] = "This field is required";
      });
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});

    try {
      const response = await fetch(
        `${BASE_URL}/api/select-donor/${SelectDonorId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/Admin/selectDonor");
          handleCloseDialog();
          handleEditSuccess();
        }, 2000);
      } else {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.application
            ? errorMessage.application[0]
            : "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating select-donor:", error);
      setError(error.message || "Failed to update. Please try again."); // Set error state for display
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddDonorClick = () => {
    navigate("/Admin/createDonor");
  };

  const handleInfoDialogOpen = () => {
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

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

  const [donorStats, setDonorStats] = useState({
    total_paid: 0,
    total_sponsored: 0,
    remaining_to_allocate: 0,
    sponsored_students: 0,
  });

  const handleCloseAlert = () => setAlert(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, donorsRes, allSelectDonorsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/all-applications/`),
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

  return (
    <Container maxWidth="100%" sx={{ marginTop: 4 }}>
      {/* cards*/}
      <Grid item xs={12} sx={{ width: "100%", marginBottom: "10px" }}>
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

      <Paper
        elevation={6} // Increased elevation for a more prominent look
        sx={{
          padding: 4,
          borderRadius: 3, // More rounded corners
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)", // Deeper shadow
          transition: "transform 0.3s ease-in-out", // Smooth hover effect for the paper
          "&:hover": {
            transform: "translateY(-5px)", // Lift effect on hover
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700, // Bolder title
            color: "#2c3e50", // Darker, modern text color
            marginBottom: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          variant="h4"
          align="center"
          gutterBottom
        >
          Edit Select Donor
          <IconButton
            onClick={handleInfoDialogOpen}
            sx={{
              marginLeft: 1,
              color: "#3498db", // Modern blue color for info icon
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)", // Pop effect on hover
                color: "#2980b9",
              },
            }}
            aria-label="information about projection generation"
          >
            <InfoIcon />
          </IconButton>
        </Typography>
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <CircularProgress sx={{ color: "#3498db" }} />{" "}
            {/* Modern blue spinner */}
          </div>
        )}
        {error && (
          <Typography
            color="error"
            align="center"
            sx={{ marginBottom: 2, fontWeight: 500 }}
          >
            Error: {error}
          </Typography>
        )}
        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
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
                  size="small"
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
                  size="small"
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

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Monthly Tuition Fee"
                  variant="outlined"
                  name="total_fee_of_the_program"
                  value={formData.total_fee_of_the_program}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
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

              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
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
                  size="small"
                  label="Health Insurance (one time)"
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
                  size="small"
                  label="Uniform Cost (one time)"
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
                  size="small"
                  label="Books & Supplies (one time)"
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
                  size="small"
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
                  size="small"
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
                  size="small"
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
              <Grid item xs={12} sm={4}>
                <TextField
                  // size="small"
                  variant="outlined"
                  name="no_of_years"
                  label="No Of Year"
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

              <Grid item xs={12} sm={12}>
                <TextField
                  select
                  size="small"
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
                  Start Date of Sponsorship
                </InputLabel>
                <TextField
                  type="date"
                  size="small"
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
                type="submit"
              >
                Assign Donor
              </Button>
              <Button
                variant="contained"
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
                onClick={handleAddDonorClick}
              >
                Add New Donor
              </Button>
            </Grid>
          </form>
        )}
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center", // Centered horizontally
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Transition} // Apply slide transition
      >
        <SnackbarContent
          sx={{
            backgroundColor: "#43a047", // Success green
            borderRadius: 2, // Rounded corners for snackbar
            fontWeight: 500,
          }}
          message="Updated successfully!"
        />
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

export default EditSelectDonorForm;
