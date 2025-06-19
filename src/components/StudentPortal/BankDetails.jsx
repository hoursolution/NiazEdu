import {
  Box,
  Input,
  Paper,
  TextField,
  Typography,
  Avatar,
  Badge,
  Button,
  Modal,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import logo from "../../assets/zeenlogo.png";
import StudentProjectionSheetTable from "./StudentProjectionSheetTable";
import { useLocation, useNavigate } from "react-router-dom";
import Profilepic from "../../assets/profile.jpg";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const BankDetails = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const [studentId, setStudentId] = useState("");
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [studentData, setStudentData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    account_title: "",
    IBAN_number: "",
    bank_name: "",
    branch_address: "",
    city: "",
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedStudentId = localStorage.getItem("studentId");
        if (!token || !storedStudentId) {
          console.error("Token not available or missing studentId.");
          return;
        }
        setStudentId(storedStudentId);
        const response = await fetch(
          `${BASE_URL}/api/studentDetails/${storedStudentId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Error fetching student details:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Student details:", data);
        setStudentData(data);
        if (data.bankdetails && data.bankdetails.length > 0) {
          setFormData(data.bankdetails[0]);
        } else {
          // If no bank details found, initialize form data with empty values
          setFormData({
            account_title: "",
            IBAN_number: "",
            bank_name: "",
            branch_address: "",
            city: "",
          });
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const storedStudentId = localStorage.getItem("studentId");
    if (!token || !storedStudentId) {
      console.error("Token not available or missing studentId.");
      return;
    }

    try {
      // Fetch the student details to get the Student instance
      const studentResponse = await fetch(
        `${BASE_URL}/api/studentDetails/${storedStudentId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!studentResponse.ok) {
        console.error(
          "Error fetching student details:",
          studentResponse.statusText
        );
        return;
      }

      const studentData = await studentResponse.json();

      const method = studentData.bankdetails[0] ? "PUT" : "POST"; // Determine HTTP method based on whether formData has an ID

      // Construct the request body with the Student instance
      const requestBody = {
        ...formData,
        student: studentData.id, // Pass the student object instead of the ID
      };

      const response = await fetch(`${BASE_URL}/api/bankDetails/`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to save bank details");
      }
      // Refetch the student details to get the updated data
      const updatedStudentResponse = await fetch(
        `${BASE_URL}/api/studentDetails/${storedStudentId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!updatedStudentResponse.ok) {
        console.error(
          "Error fetching updated student details:",
          updatedStudentResponse.statusText
        );
        return;
      }

      const updatedStudentData = await updatedStudentResponse.json();

      // Update the studentData state with the updated data
      setStudentData(updatedStudentData);

      const data = await response.json();
      console.log("Bank details saved:", data);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving bank details:", error);
    }
  };

  return (
    <div>
      <div className=" h-screen">
        <div>
          <Paper
            sx={{
              marginTop: 2,
              width: "99%",
              borderRadius: "20px",
            }}
            elevation={6}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap", // Allow items to wrap on smaller screens
                alignItems: "center",
                background:
                  "linear-gradient(0deg, rgba(31,184,195,0) 0%, rgba(57,104,120,0.6112570028011204) 100%)",
                borderRadius: "20px",
                padding: "20px",
                gap: 2, // Adds spacing between items
              }}
            >
              {/* Avatar Section */}
              <Box
                sx={{
                  flex: { xs: "100%", sm: 0.5 },
                  minWidth: 100,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt="Profile pic"
                    src={studentData?.applications?.[0].profile_picture}
                    sx={{ width: 56, height: 56 }}
                  />
                </StyledBadge>
              </Box>

              {/* Name and Program Section */}
              <Box sx={{ flex: { xs: "100%", sm: 1.5 }, minWidth: 200 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", wordBreak: "break-word" }}
                >
                  {studentData?.applications?.[0].name
                    ? studentData.applications[0].name.toUpperCase()
                    : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "10px",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {studentData?.applications?.[0].program_interested_in?.toUpperCase()}{" "}
                  | STUDENT ID {studentData?.applications?.[0].id}
                </Typography>
              </Box>

              {/* Gender, DOB, Address */}
              <Box sx={{ flex: { xs: "100%", sm: 2 }, minWidth: 200 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  GENDER: {studentData?.applications?.[0].gender.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  DOB: {studentData?.applications?.[0].date_of_birth}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  ADDRESS:{" "}
                  {studentData?.applications?.[0].address.toUpperCase()}
                </Typography>
              </Box>

              {/* Place of Birth, Residency, Institute */}
              <Box sx={{ flex: { xs: "100%", sm: 2 }, minWidth: 200 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  PLACE OF BIRTH:{" "}
                  {studentData?.applications?.[0].village.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  PLACE OF RESIDENCY:{" "}
                  {studentData?.applications?.[0].country.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  INSTITUTE:{" "}
                  {studentData?.applications?.[0].institution_interested_in.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </div>

        <Paper
          elevation={4}
          sx={{
            width: "99%",
            minHeight: "350px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(18,180,191,0.08)",
            bgcolor: "#f7fafc",
            p: { xs: 1, sm: 2, md: 4 },
            mt: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #12b4bf 0%, #14475A 100%)",
              py: { xs: 2, md: 1 },
              px: { xs: 2, md: 4 },
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(18,180,191,0.08)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              BANKING DETAILS
            </Typography>
          </Box>

          {/* Details */}
          <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 6 } }}>
            {studentData?.bankdetails.map((detail, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 4,
                  background: "#fff",
                  borderRadius: 2,
                  p: { xs: 2, md: 4 },
                  border: "1px solid #e0e7ef",
                  maxWidth: { xs: "100%", md: "900px" },
                  mx: "auto",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#14475A", fontWeight: 600 }}
                    >
                      Account Title
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {detail.account_title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#14475A", fontWeight: 600 }}
                    >
                      IBAN Number
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {detail.IBAN_number}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#14475A", fontWeight: 600 }}
                    >
                      Bank Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {detail.bank_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#14475A", fontWeight: 600 }}
                    >
                      Branch Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {detail.branch_address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#14475A", fontWeight: 600 }}
                    >
                      City
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {detail.city}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {/* Divider for clarity if multiple details */}
            {studentData?.bankdetails.length > 1 && <Divider sx={{ my: 2 }} />}
            {/* Add/Edit Button */}
            <Box sx={{ textAlign: { xs: "center", md: "right" }, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{
                  color: "white",
                  background:
                    "linear-gradient(90deg, #12b4bf 0%, #14475A 100%)",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  boxShadow: "0 2px 8px rgba(18,180,191,0.08)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #14475A 0%, #12b4bf 100%)",
                  },
                }}
              >
                Add / Edit
              </Button>
            </Box>
          </Box>
        </Paper>
        {/* Modal for editing bank details */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: 400,
            }}
          >
            {/* Bank details form */}
            <Typography variant="h6" gutterBottom>
              Add / Edit Bank Details
            </Typography>
            <TextField
              label="Account Title"
              name="account_title"
              value={formData.account_title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="IBAN Number"
              name="IBAN_number"
              value={formData.IBAN_number}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bank Name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Branch Address"
              name="branch_address"
              value={formData.branch_address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default BankDetails;
