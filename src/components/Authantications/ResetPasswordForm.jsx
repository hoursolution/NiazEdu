import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const { resetToken } = useParams(); // Get reset token from URL params
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reset_token: resetToken, password }),
      });
      const data = await response.json();
      console.log(data); // Log response data
      setSuccessMessage(data.message); // Set success message from backend response
      setTimeout(() => {
        navigate("/login"); // Navigate to the login page
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <Typography variant="h4">Reset Password</Typography>
        <TextField
          label="New Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
          style={{ marginTop: "1rem" }}
        >
          Submit
        </Button>
        <Snackbar
          open={!!successMessage}
          message={successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        />
      </div>
    </Container>
  );
}

export default PasswordReset;
