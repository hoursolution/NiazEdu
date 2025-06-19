import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import DashBoardBox1 from "./DashBoardBox1";
import StudentDashBoardTable from "./StudentDashBoardTable";

const StudentDashBoard = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [projections, setProjections] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [studentId, setStudentId] = useState(""); // Declare studentId state

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedStudentId = localStorage.getItem("studentId");
        if (!token || !storedStudentId) {
          console.error("Token not available or missing studentId.");
          return;
        }

        setStudentId(storedStudentId); // Set studentId state

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
        setStudentDetails(data);
        setProjections(data.projections || []);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  return (
    <div>
      <Grid
        container
        spacing={1}
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <Grid item xs={12} md={5}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: "15px",
            }}
          >
            <DashBoardBox1 />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: "15px",
            }}
          >
            {/* Add your Box2 component here */}
          </Paper>
        </Grid>
        <StudentDashBoardTable studentDetails={studentDetails} />
      </Grid>
    </div>
  );
};

export default StudentDashBoard;
