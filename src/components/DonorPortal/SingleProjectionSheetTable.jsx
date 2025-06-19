import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import styles from "./ProjectionSheetTable.module.css";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AttachFileIcon from "@mui/icons-material/AttachFile";
const columns = [
  // { field: "id", headerName: "ID", width: 90 },
  { field: "semester", headerName: "Semester / Month", width: 140 },
  { field: "tuition_fee", headerName: "Tuition Fee (PKR)", width: 150 },
  { field: "other_fee", headerName: "Other Fee", width: 150 },
  { field: "total_cost", headerName: "Total Cost", width: 150 },
  {
    field: "sponsor_name1",
    headerName: "Sponsor 1",
    width: 150,
  },
  {
    field: "sponsor_commitment1",
    headerName: "Commitment 1 (RS)",
    width: 150,
  },
  {
    field: "sponsor_percent1",
    headerName: "Percent 1 (%)",
    width: 150,
  },
  {
    field: "sponsor_name2",
    headerName: "Sponsor 2nd",
    width: 150,
  },
  {
    field: "sponsor_commitment2",
    headerName: "Commitment 2 (RS) ",
    width: 150,
  },
  {
    field: "sponsor_percent2",
    headerName: "Percent 2 (%)",
    width: 150,
  },
  { field: "fee_due_date", headerName: "Fee Due Date", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "payment_date", headerName: "Payment Date", width: 150 },
  {
    field: "results",
    headerName: "RESULTS",
    width: 100,
    // flex: 1,
    renderCell: (params) => (
      <Box>
        {params.value && params.value.result ? (
          <IconButton
            variant="contained"
            color="success"
            size="small"
            // style={{
            //   // backgroundColor: "#064606",
            //   fontSize: "1px",
            //   // color: "white",
            // }}
            onClick={() => window.open(params.value.result, "_blank")}
          >
            <FactCheckIcon />
            {/* <span className="button-text">View Results</span> */}
          </IconButton>
        ) : (
          <span className="button-text">"Not Avalible"</span>
        )}
      </Box>
    ),
  },
  {
    field: "other_documents",
    headerName: "OTHER DOCUMENTS",
    width: 100,
    // flex: 1,

    renderCell: (params) => (
      <Box>
        {params.value && params.value.documents ? (
          <IconButton
            variant="contained"
            color="info"
            size="small"
            // style={{
            //   backgroundColor: "#064606",
            //   fontSize: "10px",
            //   color: "white",
            // }}
            onClick={() => window.open(params.value.documents, "_blank")}
          >
            <AttachFileIcon />
          </IconButton>
        ) : (
          <span className="button-text">Not Avalible</span>
        )}
      </Box>
    ),
  },
];
// const rows = [
//   {
//     id: 1,
//     column1: "Value 1",
//     column2: "Value 2",
//     column3: "Value 3",
//     column4: "Value 4",
//     column5: "Value 5",
//     column6: "Value 6",
//     column7: "Value 7",
//     column8: "Value 8",
//     /* ... */ column9: "Value 9",
//   },
//   {
//     id: 2,
//     column1: "Value 1",
//     column2: "Value 2",
//     /* ... */ column9: "Value 9",
//   },
//   // Add more rows as needed
// ];

const SingleProjectionSheetTable = ({ studentId }) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [projections, setProjections] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !studentId) {
          console.error("Token not available or missing studentId.");
          return;
        }

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
        setStudentDetails(data);
        setProjections(data.projections || []);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  return (
    <Paper elevation={6} sx={{ marginTop: "10px", width: "99%" }}>
      <Box
        sx={{ height: 400, width: "100%", marginTop: 2, maxHeight: "320px" }}
        className="Projectionsheet-table"
      >
        <DataGrid
          rows={projections}
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

export default SingleProjectionSheetTable;
