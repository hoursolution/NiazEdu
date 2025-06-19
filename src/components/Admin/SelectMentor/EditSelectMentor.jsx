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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EditSelectMentorForm = ({
  SelectMentorId,
  handleCloseDialog,
  handleEditSuccess,
}) => {
  const navigate = useNavigate();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    mentor: "",
    selection_date: "",
  });
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [selectMentorResponse, studentsResponse, mentorsResponse] =
          await Promise.all([
            fetch(`${BASE_URL}/api/select-mentor/${SelectMentorId}/`),
            fetch(`${BASE_URL}/students/`),
            fetch(`${BASE_URL}/api/mentor/`),
          ]);

        if (!selectMentorResponse.ok) {
          throw new Error("Failed to fetch select-mentor data");
        }

        const selectMentorData = await selectMentorResponse.json();
        const studentsData = await studentsResponse.json();
        const mentorsData = await mentorsResponse.json();

        setFormData(selectMentorData);
        setStudents(studentsData);
        setMentors(mentorsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [SelectMentorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/select-mentor/${SelectMentorId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSnackbarOpen(true); // Open Snackbar upon successful submission
        // Redirect to the desired page after submission
        setTimeout(() => {
          navigate("/Admin/selectMentor");
          handleCloseDialog();
          handleEditSuccess();
        }, 2000); // Redirect after 2 seconds
      } else {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.application
            ? errorMessage.application[0]
            : "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating select-mentor:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddMentorClick = () => {
    navigate("/Admin/createMentor");
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 2 }}>
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography
          sx={{ fontWeight: 700, color: "#0a2547" }}
          variant="h5"
          align="center"
          gutterBottom
        >
          EDIT SELECT MENTOR
        </Typography>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={12}>
                <TextField
                  select
                  label="Select Student"
                  variant="outlined"
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.student_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  select
                  label="Select Mentor"
                  variant="outlined"
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {mentors.map((mentor) => (
                    <MenuItem key={mentor.id} value={mentor.id}>
                      {mentor.mentor_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel shrink>Date Since Mentor Assigned</InputLabel>
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

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignContent: "end",
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "#14475a" }}
                onClick={handleSubmit}
                style={{ marginLeft: "10px" }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1fb8c3", marginLeft: 35 }}
                onClick={handleAddMentorClick}
              >
                Add Mentor
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
    </Container>
  );
};

export default EditSelectMentorForm;
