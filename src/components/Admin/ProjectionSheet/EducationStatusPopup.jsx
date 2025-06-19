import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const EducationStatusPopup = ({
  open,
  handleClose,
  applicationId,
  studentId,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [existingStatus, setExistingStatus] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // const BASE_URL = "http://127.0.0.1:8000"; // Or your production URL
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/applications/by-student/${studentId}/${applicationId}/`
        );
        if (response.data && response.data.education_status) {
          setExistingStatus(response.data.education_status);
          setSelectedStatus(response.data.education_status);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    if (open && applicationId) {
      fetchApplicationStatus();
    }
  }, [open, applicationId]);

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirm = async () => {
    if (!selectedStatus) {
      console.error("Please select a status.");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL}/applications/${applicationId}/update-education-status/`,
        { education_status: selectedStatus }
      );
      setSnackbarMessage("Education status updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onStatusUpdate(); // Refresh the data in the parent component
      handleClosePopup();
    } catch (error) {
      console.error("Error updating education status:", error);
      setSnackbarMessage("Error updating education status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClosePopup = () => {
    handleClose();
    setSelectedStatus("");
    setExistingStatus("");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClosePopup}>
        <DialogTitle>Select Education Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select value={selectedStatus} onChange={handleChange}>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Finished">Finished</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EducationStatusPopup;
