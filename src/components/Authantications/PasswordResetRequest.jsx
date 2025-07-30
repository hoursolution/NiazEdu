import React, { useState } from "react";
import { TextField, Button, Typography, Container, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to absolute path
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    // Perform email validation
    if (!validateEmail(inputEmail)) {
      setError("Invalid email format");
    } else {
      setError("");
    }
  };

  const handleForgotPassword = async () => {
    // Email validation
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(
          data.error + " please check your Email" ||
            "An unknown error occurred."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };
  // Email validation function
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end", // Align items to the end
            width: "100%", // Set width to 100%
            // marginTop: "1rem",
          }}
        >
          <Button
            // color="success"
            sx={{
              color: "blue",
            }}
            variant="outlined"
            size="small"
            component="a"
            onClick={handleLoginClick}
            target="_blank"
          >
            LOG IN
          </Button>
        </div>
        <Typography variant="h4">Forgot Password</Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={email}
          // onChange={(e) => setEmail(e.target.value)}
          onChange={handleEmailChange}
          error={error !== ""}
          helperText={error}
          style={{ marginBottom: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleForgotPassword}
          style={{ marginTop: "1rem" }}
        >
          Submit
        </Button>
        {message && (
          <Alert severity="success" style={{ marginTop: "1rem" }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" style={{ marginTop: "1rem" }}>
            {error}
          </Alert>
        )}
      </div>
    </Container>
  );
}

export default ForgotPasswordForm;
