import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, Paper, Typography, Grid, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Pnglogo.png";
import { AccountCircle } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AppAppBar from "../Home/AppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PasswordResetRequest from "./PasswordResetRequest";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "../Home/ToggleColorMode";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to absolute path
  };
  const handleRegisterClick = () => {
    navigate("/registration"); // Navigate to absolute path
  };
  const handleForgetPasswordClick = () => {
    navigate("/password-reset-request"); // Navigate to absolute path
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/loginn/`, {
        username,
        password,
      });

      const { token, user, role, studentId, donor_name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("studentId", studentId);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("donor_name", donor_name);

      if (role === "donor") {
        navigate("/donor");
      } else if (role === "student") {
        navigate("/student");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError("Username or Password Incorrect");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login failed:", error);
    }
  };
  const [mode, setMode] = React.useState("light");

  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowPasswordReset(true);
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
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
              <Button
                color="primary"
                variant="text"
                size="small"
                component="a"
                onClick={handleLoginClick}
                target="_blank"
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  color: "#148581",
                  fontWeight: 700,
                }}
              >
                Log In
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
                  backgroundColor: "#148581",
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

        {/* main form */}
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
          {/* login form */}
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
                paddingX: "60px",
                gap: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  textAlign: "left",
                  color: "#14475a",
                  lineHeight: 1.4,
                }}
              >
                Welcome to Zeen Education Sponsorship Network, where your
                journey towards knowledge and opportunity begins!
              </Typography>
              <img src={logo} alt="logo of sitemark" />
            </Box>

            {/* form */}
            <Box
              sx={{
                backgroundColor: "#148581",
                height: "100%",
                width: "100%",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              <Box component="form">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box className="rounded-sm  pt-14 flex flex-col">
                    <Typography
                      variant="h7"
                      className="pt-3 pb-3 text-white font-bold "
                      sx={{
                        backgroundColor: "#14475a",
                        marginBottom: 3,
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                    >
                      {" "}
                      LOGIN
                    </Typography>

                    <TextField
                      label="Email"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle sx={{ color: "#fff" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          color: "#fff", // text color
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#afafaf", // outline color
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "#fff", // label color
                          "&.Mui-focused": {
                            color: "#fff",
                          },
                        },
                      }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Email"
                      style={{ marginBottom: "16px" }}
                    />

                    <TextField
                      label="Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#fff" }} />
                          </InputAdornment>
                        ),
                        sx: {
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
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "#fff",
                          "&.Mui-focused": {
                            color: "#fff",
                          },
                        },
                      }}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      style={{ marginBottom: "16px" }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showPassword}
                          sx={{ color: "#afafaf" }}
                          onChange={() => setShowPassword(!showPassword)}
                        />
                      }
                      label="Show Password"
                      style={{
                        fontSize: "8px",
                        color: "#afafaf",
                      }}
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="#991b1b"
                        sx={{ marginBottom: 2 }}
                      >
                        {error}
                      </Typography>
                    )}

                    <div className="flex ">
                      <span className="text-sm font-semibold text-red-800 cursor-pointer">
                        <a onClick={handleForgetPasswordClick}>
                          Forgot Password?
                        </a>
                        {showPasswordReset && <PasswordResetRequest />}
                      </span>
                      <span
                        className="text-sm ml-20 cursor-pointer  text-white underline"
                        onClick={handleRegisterClick}
                      >
                        Register now
                      </span>
                    </div>

                    <Button
                      variant="contained"
                      onClick={handleLogin}
                      sx={{
                        borderRadius: "5px",
                        backgroundColor: "#fff",
                        color: "#148581",
                        fontWeight: 700,
                        width: "100px",
                        marginLeft: "100px",
                        marginTop: "14px",
                        ":hover": {
                          backgroundColor: "#148581",
                          color: "#fafafa",
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Box>
  );
};

export default LoginForm;
