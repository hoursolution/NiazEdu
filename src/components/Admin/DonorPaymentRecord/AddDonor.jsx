import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DonorForm from "../Profiles/DonorForm";

const AddDonor = ({ onClose, onDonorCreated }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}/api/donor-create/`, data);
      setAlert({
        severity: "success",
        message: "Donor profile created successfully!",
      });
      if (onDonorCreated) {
        onDonorCreated(); // ✅ notify parent to reload donor list
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error creating Donor profile:", error);
      console.error("Error data:", error.response.data);

      if (error.response && error.response.data) {
        // Username already exists error

        setAlert({ severity: "error", message: error.response.data });
      } else {
        // Other errors
        setAlert({
          severity: "error",
          message: "Failed to create Donor profile.",
        });
      }
    }
  };

  return (
    <>
      <DonorForm onSubmit={onSubmit} />;
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

export default AddDonor;
