// StudentRegistrationForm.js
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Grid,
  Box,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import logo from "../../assets/NAIZ_LOGO.png";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "../Home/ToggleColorMode";
import logo1 from "../../assets/logo1.png";
import MuiAlert from "@mui/material/Alert";
import { InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WcIcon from "@mui/icons-material/Wc";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import FaceIcon from "@mui/icons-material/Face";
import bg from "../../assets/loginbg.jpg";

const logoStyle = {
  marginLeft: "30px",
  width: "100px",
  height: "50px",
  cursor: "pointer",
};

const GENDER_CHOICES = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  // { value: "Other", label: "Other" },
];

const textFieldStyles = {
  color: "#fff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#afafaf",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },

  // Label styling
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // White label on focus
  },

  // Input root and fieldset styles
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fafafa",
    },
    "& input": {
      color: "white",
      "&::placeholder": {
        color: "white", // White placeholder
        opacity: 1,
      },
    },
  },

  // Helper text
  "& .MuiFormHelperText-root": {
    color: "white",
  },

  // Icon color
  "& .MuiSvgIcon-root": {
    color: "white", // Icon color
  },
};

const StudentRegistrationForm = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [users, setUsers] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to absolute path
  };
  const handleRegisterClick = () => {
    navigate("/registration"); // Navigate to absolute path
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [mode, setMode] = React.useState("light");

  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [formData, setFormData] = useState({
    student_name: "",
    cnic: "",
    father_name: "",
    last_name: "",
    gender: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error state
    setError("");
    // Perform validation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setOpenSnackbar(true);
      return;
    }
    // Check if the username already exists
    const existingUser = users.find((user) => user.username === formData.cnic);
    if (existingUser) {
      setError("This cnic is already in use");
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/student/register/`,
        formData
      );

      // Handle success
      setSuccess("Student registered successfully");
      setOpenSnackbar(true);
      setFormData({
        student_name: "",
        cnic: "",
        father_name: "",
        last_name: "",
        gender: "",
        password: "",
        confirm_password: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      // Handle error
      setError("An error occurred. Please try again later.");
      setOpenSnackbar(true);
      console.error("Error registering student:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <ThemeProvider theme={defaultTheme}>
        {/* navbar */}
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
          }}
        >
          <Container
            maxWidth="100% "
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              marginTop: "16px",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
                alignItems: "center",
              }}
            >
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
              <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                onClick={handleLoginClick}
                target="_blank"
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#066da2",
                  color: "#fff",
                  fontWeight: 700,
                  marginTop: "2px",
                }}
              >
                LogIn
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                onClick={handleRegisterClick}
                target="_blank"
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#066da2",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                REGISTER
              </Button>
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box> */}
                  <MenuItem onClick={() => scrollToSection("features")}>
                    ZEEN
                  </MenuItem>

                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="a"
                      onClick={handleLoginClick}
                      target="_blank"
                      sx={{ width: "100%" }}
                    >
                      LOG IN
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      onClick={handleRegisterClick}
                      target="_blank"
                      sx={{ width: "100%" }}
                    >
                      REGISTER
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Container>
        </AppBar>

        {/* register form */}
        <Grid
          container
          component="main"
          sx={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#aaa",
          }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={9}
            height="70%"
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "10px",
            }}
          >
            {/* image */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "110%",
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "100%", // or any height you want
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#e2e8f0",
                  borderRadius: "100%",
                  padding: "50px",
                }}
              >
                <img src={logo} alt="logo of sitemark" width={120} />
              </Box>
            </Box>

            {/* form */}
            <Box
              sx={{
                backgroundColor: "#e2e8f0",
                height: "100%",
                width: "100%",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              <Box>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box className="rounded-sm  p-4 flex flex-col w-96 ">
                    <Typography
                      variant="h7"
                      className="pt-3 pb-3 text-white font-bold "
                      sx={{
                        backgroundColor: "#056da1",
                        marginBottom: 3,
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                    >
                      {" "}
                      STUDENT REGISTRATION
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: "300px", // Adjust height as needed
                        overflowY: "auto",
                        paddingRight: 1, // optional, for scrollbar spacing
                        paddingY: "8px",
                      }}
                    >
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              name="student_name"
                              label="First Name"
                              value={formData.student_name}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Enter your first name"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="last_name"
                              label="Last Name"
                              value={formData.last_name}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <BadgeIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Enter your last name"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="father_name"
                              label="Father's Name"
                              value={formData.father_name}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FaceIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Enter your father name"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="cnic"
                              label="B-Form/CNIC
"
                              type="cnic"
                              value={formData.cnic}
                              onChange={handleChange}
                              required
                              fullWidth
                              helperText={
                                <span className="text-red-700">
                                  B-Form/CNIC will be considered as your
                                  username
                                </span>
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Enter your B-Form/CNIC"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              select
                              name="gender"
                              label="Gender"
                              value={formData.gender}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <WcIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Enter your gender"
                            >
                              {GENDER_CHOICES.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="password"
                              label="Password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Enter your password"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name="confirm_password"
                              label="Confirm Password"
                              type="password"
                              value={formData.confirm_password}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#066da2" }} />
                                  </InputAdornment>
                                ),
                                sx: {
                                  color: "#000", // text color
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa", // outline color
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#aaa",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#aaa",
                                    },
                                  backgroundColor: "white",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#aaa", // label color
                                  "&.Mui-focused": {
                                    color: "#aaa",
                                  },
                                },
                              }}
                              placeholder="Confirm Password"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              sx={{
                                borderRadius: "5px",
                                backgroundColor: "#066da2",
                                color: "#fff",
                                fontWeight: 700,
                                marginTop: "12px",
                                ":hover": {
                                  backgroundColor: "#066da2",
                                  color: "#fff",
                                },
                              }}
                            >
                              Register
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Box>
                  </Box>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ------------------------------------------ */}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </MuiAlert>
        </Snackbar>
      </ThemeProvider>
    </Box>
  );
};

export default StudentRegistrationForm;
