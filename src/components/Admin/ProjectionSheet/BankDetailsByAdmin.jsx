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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { useParams, useLocation, useNavigate } from "react-router-dom";

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

const BankAccountDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const [StudentId, setStudentId] = useState("");
  // const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const BASE_URL = "http://127.0.0.1:8000";
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
        // const storedStudentId = localStorage.getItem("studentId");

        if (!token || !studentId) {
          console.error("Token not available or missing studentId.");
          return;
        }
        setStudentId(studentId);
        const response = await fetch(
          `${BASE_URL}/api/studentDetails/${studentId}/`,
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
    // const storedStudentId = localStorage.getItem("studentId");
    if (!token || !studentId) {
      console.error("Token not available or missing studentId.");
      return;
    }

    try {
      // Fetch the student details to get the Student instance
      const studentResponse = await fetch(
        `${BASE_URL}/api/studentDetails/${studentId}/`,
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
        `${BASE_URL}/api/studentDetails/${studentId}/`,
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
              height: 80,
              width: "99%",
              borderRadius: "20px",
            }}
            elevation={6}
          >
            <Box
              sx={{
                marginTop: "0px",
                height: 80,
                display: "flex",
                alignItems: "center",
                background:
                  "linear-gradient(0deg, rgba(31,184,195,0) 0%, rgba(57,104,120,0.6112570028011204) 100%)",
                borderRadius: "20px",
                padding: "30px", // Added padding for spacing
              }}
            >
              <Box sx={{ flex: 0.7 }}>
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
              <Box sx={{ flex: 2, marginLeft: "1px" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {studentData?.applications?.[0].name
                    ? studentData.applications[0].name.toUpperCase()
                    : ""}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "8px" }}>
                  {studentData?.applications?.[0].current_level_of_education.toUpperCase()}{" "}
                  | STUDENT ID {studentData?.applications?.[0].id}
                </Typography>
              </Box>
              <Box sx={{ flex: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  GENDER: {studentData?.applications?.[0].gender.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  DOB: {studentData?.applications?.[0].date_of_birth}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  ADDRESS:{" "}
                  {studentData?.applications?.[0].address.toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ flex: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  PLACE OF BIRTH:{" "}
                  {studentData?.applications?.[0].village.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  PLACE OF RESIDENCY:{" "}
                  {studentData?.applications?.[0].country.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  INSTITUTE:{" "}
                  {studentData?.applications?.[0].institution_interested_in.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </div>

        <Paper
          className="w-90 h-80 mt-4"
          sx={{
            width: "99%",
          }}
        >
          <Box className="rounded-sm mt-1 p-4 flex flex-col w-full ">
            <Box
              sx={{
                width: "99%",
                backgroundColor: "#12b4bf",
                textAlign: "center",
                padding: 1,
                marginTop: 0.1,
              }}
            >
              <Typography sx={{ color: "white" }}>BANKING DETAILS </Typography>
            </Box>
            {studentData?.bankdetails.map((detail) => (
              <>
                <Box className="flex w-full ">
                  <Typography sx={{ color: "black", margin: 1 }}>
                    ACCOUNT TITLE :
                  </Typography>
                  <Typography
                    sx={{ color: "black", marginTop: 1, marginLeft: 5 }}
                  >
                    {detail.account_title}
                  </Typography>
                </Box>
                <Box className="flex w-full ">
                  <Typography sx={{ color: "black", margin: 1 }}>
                    IBAN NUMBER :
                  </Typography>
                  <Typography
                    sx={{ color: "black", marginTop: 1, marginLeft: 7 }}
                  >
                    {detail.IBAN_number}
                  </Typography>{" "}
                </Box>

                <Box className="flex w-full ">
                  <Typography sx={{ color: "black", margin: 1 }}>
                    BANK NAME :
                  </Typography>
                  <Typography
                    sx={{ color: "black", marginTop: 1, marginLeft: 8 }}
                  >
                    {detail.bank_name}
                  </Typography>
                </Box>

                <Box className="flex w-full ">
                  <Typography sx={{ color: "black", margin: 1 }}>
                    BRANCH ADDRESS :
                  </Typography>
                  <Typography
                    sx={{ color: "black", marginTop: 1, marginLeft: 2 }}
                  >
                    {detail.branch_address}
                  </Typography>
                </Box>

                <Box className="flex w-full ">
                  <Typography sx={{ color: "black", margin: 1 }}>
                    CITY :
                  </Typography>
                  <Typography
                    sx={{ color: "black", marginTop: 1, marginLeft: 17 }}
                  >
                    {detail.city}{" "}
                  </Typography>
                </Box>
              </>
            ))}
          </Box>
          {/* Button to open modal */}
          <Button
            variant="contained"
            onClick={handleOpenModal}
            sx={{
              marginLeft: "85%",
              color: "white",
              backgroundColor: "#14475A",
            }}
          >
            ADD / EDIT
          </Button>
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

export default BankAccountDetails;
