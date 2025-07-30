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

const ViewSelectDonor = ({
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
    total_fee_of_the_program: "",
    transport_amount: "",
    admission_fee_of_the_program: "",
    other_amount: "",
    health_insurance: "",
    living_expenses: "",
    food_and_necessities_expenses: "",
    birthday_gift: "",
    eid_al_fitr_month: "",
    eid_al_adha_month: "",
    eid_al_fitr_gift: "",
    eid_al_adha_gift: "",
    semester_duration: "",
    no_of_semesters: "",
    installments_per_semester: 1,
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
          View Select Donor
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
            <Grid container spacing={3}>
              {/* select feild */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Student"
                  variant="outlined"
                  name="application"
                  value={formData.application}
                  //   onChange={handleChange}
                  fullWidth
                  required
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
                  //   onChange={handleChange}
                  fullWidth
                  required
                >
                  {donors.map((donor) => (
                    <MenuItem key={donor.id} value={donor.id}>
                      {donor.donor_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* montly cost feilds */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly/Education Fee "
                  variant="outlined"
                  name="total_fee_of_the_program"
                  value={formData.total_fee_of_the_program}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Transport Fee (Monthly)"
                  variant="outlined"
                  name="transport_amount"
                  value={formData.transport_amount}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>

              {/* One-Time Costs */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Admission Fee"
                  variant="outlined"
                  name="admission_fee_of_the_program"
                  value={formData.admission_fee_of_the_program}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Other One-Time Cost"
                  variant="outlined"
                  name="other_amount"
                  value={formData.other_amount}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Health Insurance (Month 1)"
                  variant="outlined"
                  name="health_insurance"
                  value={formData.health_insurance}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Uniform Cost (Month 1)"
                  variant="outlined"
                  name="living_expenses"
                  value={formData.living_expenses}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Books and Supplies (Month 1)"
                  variant="outlined"
                  name="food_and_necessities_expenses"
                  value={formData.food_and_necessities_expenses}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Birthday Gift"
                  variant="outlined"
                  name="birthday_gift"
                  value={formData.birthday_gift}
                  //   onChange={handleChange}
                  fullWidth
                  type="number"
                  // required
                />
              </Grid>

              {/* . Special Month Triggers */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Eid al-Fitr Month"
                  variant="outlined"
                  name="eid_al_fitr_month"
                  value={formData.eid_al_fitr_month}
                  //   onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="1">January</MenuItem>
                  <MenuItem value="2">February</MenuItem>
                  <MenuItem value="3">March</MenuItem>
                  <MenuItem value="4">April</MenuItem>
                  <MenuItem value="5">May</MenuItem>
                  <MenuItem value="6">June</MenuItem>
                  <MenuItem value="7">July</MenuItem>
                  <MenuItem value="8">August</MenuItem>
                  <MenuItem value="9">September</MenuItem>
                  <MenuItem value="10">October</MenuItem>
                  <MenuItem value="11">November</MenuItem>
                  <MenuItem value="12">December</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Eid al-Adha Month"
                  variant="outlined"
                  name="eid_al_adha_month"
                  value={formData.eid_al_adha_month}
                  //   onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="1">January</MenuItem>
                  <MenuItem value="2">February</MenuItem>
                  <MenuItem value="3">March</MenuItem>
                  <MenuItem value="4">April</MenuItem>
                  <MenuItem value="5">May</MenuItem>
                  <MenuItem value="6">June</MenuItem>
                  <MenuItem value="7">July</MenuItem>
                  <MenuItem value="8">August</MenuItem>
                  <MenuItem value="9">September</MenuItem>
                  <MenuItem value="10">October</MenuItem>
                  <MenuItem value="11">November</MenuItem>
                  <MenuItem value="12">December</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Eid al-Fitr Gift</InputLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  name="eid_al_fitr_gift"
                  value={formData.eid_al_fitr_gift}
                  //   onChange={handleChange}
                  fullWidth
                  placeholder="Eid al-Fitr Gift"
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Eid al-Adha Gift</InputLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  name="eid_al_adha_gift"
                  value={formData.eid_al_adha_gift}
                  //   onChange={handleChange}
                  fullWidth
                  placeholder="Eid al-Adha Gift"

                  // required
                />
              </Grid>

              {/* <Grid item xs={12} sm={4}>
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
                         </Grid> */}

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

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Generate auto Projection sheet"
                  variant="outlined"
                  name="trigger_projection"
                  value={formData.trigger_projection}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel shrink>Start Date of Sponsorship</InputLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  name="selection_date"
                  value={formData.selection_date}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            {/* <div
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
            </div> */}
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

export default ViewSelectDonor;
