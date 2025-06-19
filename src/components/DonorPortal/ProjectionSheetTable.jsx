import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";
import styles from "./ProjectionSheetTable.module.css";

const columns = [
  { field: "student_name", headerName: "Name", width: 90 },
  // { field: "semester", headerName: "Semester", flex: 1 },
  { field: "tuition_fee", headerName: "Tuition Fee (PKR)", flex: 1 },
  { field: "other_fee", headerName: "Other Fee", flex: 1 },
  { field: "total_cost", headerName: "Total Cost", flex: 1 },
  {
    field: "sponsorship_commitment",
    headerName: "Sponsorship Commitment (%)",
    flex: 1,
  },
  { field: "fee_due_date", headerName: "Fee Due Date", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
  { field: "payment_date", headerName: "Payment Date", flex: 1 },
];

const ProjectionSheetTable = ({ studentIds }) => {
  const [projectionsData, setProjectionsData] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  useEffect(() => {
    if (studentIds.length === 0) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not available.");
      return;
    }

    // Use Promise.all to fetch the first projection for each student concurrently
    Promise.all(
      studentIds.map((studentId) =>
        fetch(`${BASE_URL}/api/studentDetails/${studentId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Extract the first projection if available
            const [firstProjection] = data.projections || [];
            return {
              id: studentId,
              student_name: data.student_name,
              ...firstProjection,
            };
          })
          .catch((error) => {
            console.error(
              `Error fetching first projection for student ${studentId}:`,
              error
            );

            return null;
          })
      )
    )
      .then((projectionsList) => {
        // Remove null values (failed fetches) and set the projections data
        const filteredProjections = projectionsList.filter(
          (projection) => projection !== null
        );
        setProjectionsData(filteredProjections);
      })
      .catch((error) => {
        console.error("Error fetching projections for all students:", error);
      });
  }, [studentIds]);

  return (
    <Paper elevation={3} sx={{ marginTop: "10px" }}>
      <Box
        sx={{ height: 400, width: "100%", marginTop: 2, maxHeight: "320px" }}
        className="Projectionsheet-table"
      >
        <DataGrid
          rows={projectionsData}
          columns={columns}
          density="compact"
          classes={{
            columnHeader: styles["custom-datagrid-header"],
          }}
          pageSize={5}
          // checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default ProjectionSheetTable;
