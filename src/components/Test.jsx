import React from "react";
import logo from "../assets/zeenlogo.png";
import { purple } from "@mui/material/colors";
import { Grid, TextField, Container, Paper } from "@mui/material";

// import "./Test.css";

const Test = () => {
  return (
    <>
      <Container style={{ display: "flex", height: "100vh" }}>
        <Paper style={{ width: "30%", overflow: "hidden" }}>
          <img
            src={logo}
            alt="Sample Image"
            style={{ width: "100%", height: "59%" }}
          />
        </Paper>

        <Paper style={{ width: "70%", padding: "16px" }}>
          <Grid container spacing={1}>
            {[...Array(12)].map((_, index) => (
              <Grid item xs={4} key={index} style={{ marginBottom: "16px" }}>
                <TextField
                  label={`Field ${index + 1}`}
                  // fullWidth
                  size="small"
                  variant="standard"
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default Test;
