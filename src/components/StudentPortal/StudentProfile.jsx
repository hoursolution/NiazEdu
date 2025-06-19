// StudentProfile.js

import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
} from "@mui/material";
import { red } from "@mui/material/colors";
import logo from "../../assets/zeenlogo.png";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const StudentProfile = () => {
  const [applicationData, setApplicationData] = useState(null);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  useEffect(() => {
    // Make an API request to retrieve the data
    axios
      .get(`${BASE_URL}/api/applications/1`) // Replace with your actual API endpoint
      .then((response) => {
        setApplicationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      {applicationData && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Applications
            </Typography>

            <Grid container spacing={2}>
              {Object.entries(applicationData).map(([field, value]) => (
                <Grid item xs={4} key={field}>
                  <Typography variant="body2" color="textSecondary">
                    {field}:
                  </Typography>
                  <Typography variant="body1">{value}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
    // <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
    //   <Typography variant="h4" gutterBottom>
    //     {student.name}'s Profile
    //   </Typography>

    //   <Box display="flex" flexDirection="row">
    //     <Box marginBottom="20px">
    //       <Paper
    //         sx={{
    //           width: "280px",
    //           background: "#e4e4e4",
    //         }}
    //       >
    //         <Typography variant="h5">Personal Information</Typography>
    //       </Paper>
    //       <Grid container>
    //         {/* <Grid item> */}
    //         <Paper
    //           sx={{
    //             width: "280px",
    //             background: "#e4e4e4",
    //             marginBottom: "20px",
    //           }}
    //         ></Paper>
    //         {/* </Grid> */}
    //       </Grid>

    //       {/* Add other student details as needed */}
    //     </Box>
    //     <Paper
    //       sx={{
    //         width: "280px",
    //         background: "white",
    //         marginLeft: "100px",
    //       }}
    //     >
    //       <Box>
    //         <Paper
    //           sx={{
    //             width: "280px",
    //             background: "#e4e4e4",
    //           }}
    //         >
    //           <Typography variant="h5" gutterBottom>
    //             Educational Qualifications
    //           </Typography>
    //         </Paper>
    //         <Paper
    //           sx={{
    //             width: "280px",
    //             background: "#e4e4e4",
    //           }}
    //         >
    //           {student.degrees && student.degrees.length > 0 ? (
    //             <List>
    //               {student.degrees.map((degree) => (
    //                 <ListItem key={degree.id}>
    //                   <ListItemText
    //                     primary={`Degree: ${degree.degree_name}`}
    //                     secondary={`Status: ${degree.status}`}
    //                   />
    //                   <ListItemText
    //                     primary={`Institute: ${degree.institute_name}`}
    //                   />
    //                 </ListItem>
    //               ))}
    //             </List>
    //           ) : (
    //             <Typography variant="body2" color="textSecondary">
    //               No degree information available
    //             </Typography>
    //           )}
    //         </Paper>
    //       </Box>
    //     </Paper>
    //   </Box>
    // </Paper>
  );
};

export default StudentProfile;
