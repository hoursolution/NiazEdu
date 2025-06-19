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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

const EditSelectDonorForm = ({
  SelectDonorId,
  handleCloseDialog,
  handleEditSuccess,
}) => {
  const navigate = useNavigate();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    application: "",
    donor: "",
    admission_fee_considered: "",
    education_fee_considered: "",
    other_cost_considered: "",
    admission_fee_persentage_considered: "",
    education_fee_persentage_considered: "",
    other_cost_persentage_considered: "",
    no_of_years: "",
    no_of_semesters: "",
    installments_per_semester: 1,
    semester_duration: "",
    trigger_projection: "No",
    selection_date: "",
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
          trigger_projection: "No",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields if projection is Yes
    const requiredFields =
      formData.trigger_projection === "Yes"
        ? [
            "no_of_years",
            "no_of_semesters",
            "installments_per_semester",
            "semester_duration",
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

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography
          sx={{ fontWeight: 700, color: "#0a2547" }}
          variant="h4"
          align="center"
          gutterBottom
        >
          Edit Select Donor
          <IconButton
            onClick={handleInfoDialogOpen}
            sx={{ marginLeft: 1 }}
            color="primary"
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
            <CircularProgress />
          </div>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
            Error: {error}
          </Typography>
        )}
        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Student"
                  variant="outlined"
                  name="application"
                  value={formData.application}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      application: parseInt(e.target.value, 10),
                    })
                  }
                  fullWidth
                  required
                >
                  {students.map((app) => (
                    <MenuItem key={app.id} value={app.id}>
                      {app.displayNameWithOrder}
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
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  {donors.map((donor) => (
                    <MenuItem key={donor.id} value={donor.id}>
                      {donor.donor_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Admission Fee Amount"
                  variant="outlined"
                  name="admission_fee_considered"
                  value={formData.admission_fee_considered}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Admission Fee (%)"
                  variant="outlined"
                  name="admission_fee_persentage_considered"
                  value={formData.admission_fee_persentage_considered}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Education Fee Amount"
                  variant="outlined"
                  name="education_fee_considered"
                  value={formData.education_fee_considered}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Education Fee (%)"
                  variant="outlined"
                  name="education_fee_persentage_considered"
                  value={formData.education_fee_persentage_considered}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Other Costs Amount"
                  variant="outlined"
                  name="other_cost_considered"
                  value={formData.other_cost_considered}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Other Costs (%)"
                  variant="outlined"
                  name="other_cost_persentage_considered"
                  value={formData.other_cost_persentage_considered}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel shrink>
                  No Of Years <span>*</span>
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
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  {[1, 2, 3, 4, 5].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

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
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  {[...Array(12).keys()].map((i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label={
                    formData.semester_duration === "1"
                      ? "Installments Per Month"
                      : "Installments Per Semester"
                  }
                  variant="outlined"
                  name="installments_per_semester"
                  value={
                    formData.semester_duration === "1"
                      ? "1"
                      : formData.installments_per_semester
                  }
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  disabled={formData.semester_duration === "1"}
                  inputProps={{ min: 1 }}
                  required={formData.trigger_projection === "Yes"}
                  error={!!fieldErrors.installments_per_semester}
                  helperText={fieldErrors.installments_per_semester}
                  sx={{ backgroundColor: "#f5f5f5" }}
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
                    handleChange(e);
                    if (e.target.value === "1") {
                      setFormData((prev) => ({
                        ...prev,
                        installments_per_semester: "1",
                      }));
                    }
                  }}
                  fullWidth
                  required
                  error={!!fieldErrors.semester_duration}
                  helperText={fieldErrors.semester_duration}
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  <MenuItem value="1">Monthly Projection</MenuItem>
                  <MenuItem value="6">Semester Projection</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Generate Auto Projection Sheet"
                  variant="outlined"
                  name="trigger_projection"
                  value={formData.trigger_projection}
                  onChange={handleChange}
                  fullWidth
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel shrink>Date Since Sponsorship Commenced</InputLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  name="selection_date"
                  value={formData.selection_date}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ backgroundColor: "#f5f5f5" }}
                />
              </Grid>
            </Grid>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00796b",
                  "&:hover": { backgroundColor: "#004d40" },
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#1fb8c3",
                  color: "#1fb8c3",
                  marginLeft: 2,
                  "&:hover": {
                    borderColor: "#1fb8c3",
                    backgroundColor: "#e0f7fa",
                  },
                }}
                onClick={handleAddDonorClick}
              >
                Add Donor
              </Button>
            </div>
          </form>
        )}
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          sx={{
            backgroundColor: "#43a047",
          }}
          message="Updated successfully!"
        />
      </Snackbar>

      <Dialog
        open={infoDialogOpen}
        onClose={handleInfoDialogClose}
        sx={{
          "& .MuiDialog-paper": { borderRadius: 3, padding: 2, maxWidth: 600 },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "1.5rem", color: "#1A1A1A" }}
        >
          How Auto Generate Projections Work
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Typography
            variant="body1"
            sx={{ color: "#4A4A4A", lineHeight: 1.6, mb: 3 }}
          >
            Your inputs shape the financial projections for your program,
            creating a clear payment schedule based on your choices.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "#1A1A1A", mb: 1 }}
            >
              Your Inputs
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: "#4A4A4A" }}>
              <li>
                <strong>Duration</strong>: Sets if your program is monthly (1
                month) or semester-based (e.g., 6 months).
              </li>
              <li>
                <strong>Program Years</strong>: Total duration of the program.
              </li>
              <li>
                <strong>Semesters/Months</strong>: Number of semesters or months
                in the program.
              </li>
              <li>
                <strong>Installments</strong>: Payments per semester (for
                semester-based programs).
              </li>
              <li>
                <strong>Fees & Contributions</strong>: Admission, education, and
                other fees, plus the sponsor’s percentage for each.
              </li>
              <li>
                <strong>Start Date</strong>: Program start, anchoring payment
                due dates.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "#1A1A1A", mb: 1 }}
            >
              Monthly Programs
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: "#4A4A4A" }}>
              <li>
                Kicks in when Select Monthly is{" "}
                <strong>(No of years X no of months)</strong>.
              </li>
              <li>One payment per month for the program’s duration.</li>
              <li>
                <strong>Admission Fee</strong>: Added to the first month’s
                payment (if set), using the sponsor’s percentage.
              </li>
              <li>
                <strong>Education & Other Fees</strong>: Split evenly across all
                months, based on sponsor percentages.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "#1A1A1A", mb: 1 }}
            >
              Semester-Based Programs
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: "#4A4A4A" }}>
              <li>
                Applies when semester duration exceeds 1 month (e.g., 2 or 6
                months).
              </li>
              <li>
                Payments split into installments per semester, based on your
                input.
              </li>
              <li>
                <strong>Admission Fee</strong>: Added to the first installment
                of the first semester (if set).
              </li>
              <li>
                <strong>Education & Other Fees</strong>: Spread across semesters
                and installments, using sponsor percentages.
              </li>
              <li>
                Estimated dates of Payment align with semester duration and
                installment frequency, starting from the program’s start date.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "#1A1A1A", mb: 1 }}
            >
              Fee Breakdown
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: "#4A4A4A" }}>
              <li>
                <strong>Sponsor Contributions</strong>: Only the percentages you
                set for each fee (admission, education, other) are included.
              </li>
              <li>
                <strong>Total Payment</strong>: Combines sponsor contributions
                for each fee per payment.
              </li>
              <li>
                Fees are evenly distributed across months or
                semesters/installments.
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, color: "#1A1A1A", mb: 1 }}
            >
              Good to Know
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: "#4A4A4A" }}>
              <li>
                Update inputs and select “Yes” to regenerate projections—old
                ones are cleared for accuracy.
              </li>
              <li>
                First payment aligns with the program’s start date; others
                follow the schedule.
              </li>
              <li>
                Percentages are displayed in projections for full transparency.
              </li>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: "#6B7280", fontStyle: "italic", mt: 2 }}
          >
            Pro Tip: Tweak fees, percentages, or durations anytime to update
            your projections instantly.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleInfoDialogClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#3B82F6",
              "&:hover": { backgroundColor: "#2563EB" },
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
