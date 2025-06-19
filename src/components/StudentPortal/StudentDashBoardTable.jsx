import React, { useCallback, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./StudentDashBoardTable.css";
// import InvoicePopup from "./InvoicePopup";
// import Invoice from "./Invoice";

const StudentDashBoardTable = ({ studentDetails }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const [studentsData, setStudentsData] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [isInvoicePopupOpen, setIsInvoicePopupOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Define handleProjectionsheetClick using useCallback
  const handleProjectionsheetClick = useCallback(() => {
    navigate("myprojection");
  }, [navigate]);

  // Define handleButtonClick
  const handleButtonClick = useCallback(
    (buttonType, studentId) => {
      // Example: navigate to a student details page with student data as state
      navigate("myprojection", {
        state: { studentId: studentId },
      });
    },
    [navigate]
  );

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "NAME",
      width: 100,
    },
    {
      field: "city",
      headerName: "CITY",
      width: 100,
    },
    {
      field: "program",
      headerName: "PROGRAM",
      // type: "number",
      width: 110,
    },
    {
      field: "level",
      headerName: "LEVEL",

      sortable: false,
      width: 110,
    },
    {
      field: "education",
      headerName: "EDUCATION",
      // type: "number",
      width: 210,
    },

    {
      field: "results",
      headerName: "RESULTS",
      width: 140,
      renderCell: (params) => (
        <Box>
          {/* Button for Student Details */}

          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ backgroundColor: "#304c49", fontSize: "10px" }}
            onClick={() => handleButtonClick("Student Details", params.row.id)}
          >
            <span className="button-text">Upload Results</span>
          </Button>
        </Box>
      ),
    },
    {
      field: "Fee Status",
      headerName: "FEE STATUS",
      width: 140,
      renderCell: (params) => (
        <Box>
          {/* Button for Student Details */}
          <Button
            variant="contained"
            color="info"
            size="small"
            style={{ backgroundColor: "#ff8a35", fontSize: "10px" }}
            // onClick={() => handleGenerateInvoice(params.row)}
          >
            <span className="button-text">upload challan</span>
          </Button>
        </Box>
      ),
    },
    {
      field: "Projection",
      headerName: "PROJECTION",
      width: 140,
      renderCell: (params) => (
        <Box>
          {/* Button for Student Results */}
          <Button
            variant="contained"
            color="success"
            size="small"
            style={{ backgroundColor: "#304c49", fontSize: "10px" }}
            onClick={() => handleButtonClick("Student Details", params.row.id)}
          >
            <span className="button-text">view</span>
          </Button>
        </Box>
      ),
    },
  ];
  const getSemesterText = (semester) => {
    if (semester <= 8) {
      return `Semester ${semester}`;
    } else {
      // Calculate the corresponding month
      // const month = (semester - 1) * 3; // Assuming each semester is 3 months
      return `Month ${semester}`;
    }
  };

  const rows =
    studentDetails?.applications?.map((application) => {
      const latestProjection = studentDetails.projections?.reduce(
        (latest, projection) => {
          return projection.semester > (latest?.semester || 0)
            ? projection
            : latest;
        },
        null
      );

      return {
        id: application.id,
        name: application.name,
        city: application.city,
        program: application.institution_interested_in,
        education: application.current_level_of_education,
        level: latestProjection
          ? getSemesterText(latestProjection.semester)
          : "N/A",
        // Add more fields based on your data structure
      };
    }) || [];

  // const rows =
  //   studentDetails?.applications?.map((application) => ({
  //     id: application.id,
  //     name: application.name,
  //     city: application.city,
  //     program: application.institution_interested_in,
  //     education: application.current_level_of_education,
  //     // level: application.program_interested_in,
  //     // Add more fields based on your data structure
  //   })) || [];

  const handleGenerateInvoice = (selectedRow) => {
    // Logic to create invoice based on the selected row data
    const generatedInvoiceData = {
      invoiceNumber: `INV-${selectedRow.id}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date().toLocaleDateString(),
      items: [
        { description: "Tuition Fee", amount: 500 },
        // Add more items as needed
      ],
    };

    // Set the generated invoice data and open the popup
    setInvoiceData(generatedInvoiceData);
    setIsInvoicePopupOpen(true);
  };

  const handleCloseInvoicePopup = () => {
    // Close the popup when the user clicks Close
    setIsInvoicePopupOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: "#d7e5d7",
        marginTop: "10px",
        marginLeft: 1,
      }}
    >
      <Box
        sx={{
          height: 400,
          width: "100%",
          marginTop: 0,

          maxHeight: "287px",
        }}
        className="dashboard-table"
      >
        <Typography
          variant="h6"
          sx={{
            marginLeft: 2,
            paddingBottom: 2,
            paddingTop: 0,
            marginTop: 0,
            fontWeight: "bold",
            color: "#304c49",
          }}
        >
          YOUR DATA
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          density="compact"
          classes={{
            columnHeader: "custom-datagrid-header",
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          // disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default StudentDashBoardTable;
