// src/components/StudentList.js

import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Grid,
} from "@mui/material";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  useEffect(() => {
    // Fetch the list of students from the API
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/students/`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching student list:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Student List
      </Typography>
      <List>
        <Grid container spacing={3}>
          {students &&
            students.map((student) => (
              <Grid item xs={12} sm={6} md={3} key={student.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {student.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {`Father's Name: ${student.fathers_name}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Date of Birth: ${student.date_of_birth}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Gender: ${student.gender}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Country: ${student.country}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Province: ${student.province}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`City: ${student.city}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Mobile Number: ${student.mobile_number}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Email: ${student.email}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Village: ${student.village}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Financial Need: $${student.financial_need}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {`Career Goals: ${student.career_goals}`}
                        </Typography>

                        {/* ... (other details) */}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Grid>
            ))}
        </Grid>
      </List>
    </Paper>
  );
};

export default StudentList;
