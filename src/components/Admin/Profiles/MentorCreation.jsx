import React, { useState } from "react";
import MentorForm from "./MentorForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const MentorCreation = ({ onClose }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}/api/mentor-create/`, data);
      setAlert({
        severity: "success",
        message: "Mentor profile created successfully!",
      });

      setTimeout(() => {
        onClose();
        navigate("/admin/selectMentor");
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error("Error creating mentor profile:", error);
      console.error("Error data:", error.response.data);

      if (error.response && error.response.data) {
        // Username already exists error

        setAlert({ severity: "error", message: error.response.data });
      } else {
        // Other errors
        setAlert({
          severity: "error",
          message: "Failed to create mentor profile.",
        });
      }
    }
  };

  return (
    <>
      <MentorForm onSubmit={onSubmit} />
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

export default MentorCreation;
