import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { borderRadius, padding, styled, textAlign } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { ThumbUp, Visibility } from "@mui/icons-material";

const BASE_URL = "https://zeenbackend-production.up.railway.app";
// const BASE_URL = "http://127.0.0.1:8000";
// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

// Custom GridToolbar
const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: cardBg, // Match table background
        borderBottom: `1px solid ${headerBg}`,
        padding: "8px",
        borderRadius: "8px 8px 0 0", // Match table border radius
      }}
    >
      <GridToolbarColumnsButton sx={{ color: textColor }} />
      <GridToolbarDensitySelector sx={{ color: textColor }} />
      {/* GridToolbarFilterButton is not used in the original CustomToolbar, but can be added if needed */}
      {/* <GridToolbarFilterButton sx={{ color: textColor }} /> */}
    </GridToolbarContainer>
  );
};

// Custom styled DataGrid component
const StyledDataGrid = styled(DataGrid)({
  border: `1px solid ${cardBg}`, // Subtle border
  borderRadius: "8px", // Rounded corners for the whole table
  overflow: "hidden", // Ensures rounded corners are visible

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: headerBg, // Darker header background
    color: textColor, // White text for headers
    fontSize: "13px",
    textTransform: "uppercase", // More modern look
    fontWeight: "bold",
    borderBottom: `1px solid ${accentColor}`, // Accent line below headers
  },
  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: `1px solid #aaa`, // Subtle border between headers
    textAlign: "center",
    whiteSpace: "normal",
    "&:first-of-type": {
      // Remove left border for the first header
      borderLeft: "none",
    },
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    whiteSpace: "normal",
    lineHeight: 1.2,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  "& .MuiDataGrid-cell": {
    borderLeft: `1px solid #aaa`, // Subtle border between cells
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    whiteSpace: "normal",
    wordWrap: "break-word",
    lineHeight: 1.4,
    padding: "6px",
    fontSize: "12px",
    color: textColor, // Default cell text color
    "&:first-of-type": {
      // Remove left border for the first cell in a row
      borderLeft: "none",
    },
  },
  "& .MuiDataGrid-row": {
    backgroundColor: cardBg, // Dark background for rows
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(255, 255, 255, 0.65)", // Slightly different shade for odd rows (zebra striping)
    },
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.15)", // Accent color on hover
    },
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: headerBg, // Match header background for footer
    color: textColor,
    borderTop: `1px solid ${accentColor}`,
    borderRadius: "0 0 8px 8px", // Match table border radius
  },
  "& .MuiTablePagination-root": {
    color: textColor, // Pagination text color
  },
  "& .MuiSvgIcon-root": {
    color: textColor, // Pagination icons color
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: "10px",
  // margin: "2px 4px",
  textTransform: "capitalize",
  borderRadius: "16px",
  width: "80px", // fixed width
  height: "26px", // fixed height
  padding: "2px 6px", // ensure internal spacing
  justifyContent: "center", // align icon + text nicely
}));

const ProjectionDashboard1 = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  // Fetch students with error handling
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/api/student-projection-data/`
      );

      const rawData = response.data.results;

      console.log(rawData);
      const processedData = rawData.flatMap((student) => {
        return student.applications.map((app) => {
          const proj = app.projection || {};
          return {
            id: `${student.id}-${app.id}`,
            fullName: `${student.student_name || ""} ${
              student.last_name || ""
            }`,
            sponsor:
              student.select_donor.find((sd) => sd.application === app.id)
                ?.donor_name || "N/A",
            semester: proj.semester_number || "",
            amount: proj.total_amount || "",
            percentage: proj.percentage || "",
            status: proj.status || "Pending",
            dueDate: proj.challan_due_date
              ? new Date(proj.challan_due_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })
              : "",
            program: app.program_interested_in || "N/A",
            rawApplicationId: app.id,
          };
        });
      });

      const sorted = processedData.sort(
        (a, b) => a.rawApplicationId - b.rawApplicationId
      );

      setStudents(sorted);
      setFilteredStudents(sorted);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter logic
  const filterStudents = useCallback(() => {
    let filtered = [...students];

    if (searchText) {
      filtered = filtered.filter((student) =>
        student.fullName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterByStatus) {
      filtered = filtered.filter(
        (student) => student.status === filterByStatus
      );
    }

    setFilteredStudents(filtered);
  }, [searchText, filterByStatus, students]);

  // Effect hooks
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    filterStudents();
  }, [filterStudents]);

  const handleViewProjection = (studentId) => {
    navigate(`/Admin/students/${studentId}/projections`);
  };

  const columns = [
    {
      field: "seq_no",
      headerName: "S.No",
      flex: 1,
      minWidth: 50,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => filteredStudents.indexOf(params.row) + 1,
    },
    {
      field: "fullName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "sponsor",
      headerName: "Sponsor Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    }, // Hide on small screens
    {
      field: "percentage",
      headerName: "Sponsor Percentage",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;
        const status = params.row.status;
        return value !== null && value !== undefined && value !== "" ? (
          value
        ) : status === "Finished" ? (
          "-"
        ) : (
          <span style={{ color: "red" }}>no date</span>
        );
      },
    },
    {
      field: "semester",
      headerName: "Semester/Months",
      flex: 1,
      minWidth: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;
        const status = params.row.status;
        return value !== null && value !== undefined && value !== "" ? (
          value
        ) : status === "Finished" ? (
          "-"
        ) : (
          <span style={{ color: "red" }}>no data</span>
        );
      },
    },
    {
      field: "amount",
      headerName: "Current Total Amount",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;
        const status = params.row.status;
        return value !== null && value !== undefined && value !== "" ? (
          parseFloat(value).toLocaleString()
        ) : status === "Finished" ? (
          "-"
        ) : (
          <span style={{ color: "red" }}>no data</span>
        );
      },
    },

    {
      field: "Status",
      headerName: "Fee Status",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let buttonColor = "";
        let buttonIcon = null;
        let label = params.row.status;

        const feeStatus = params.row.status;

        switch (feeStatus) {
          case "Paid":
            buttonColor = "#4CAF50"; // Green
            buttonIcon = (
              <CheckCircleIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Pending":
            buttonColor = "#2196F3"; // Blue
            buttonIcon = (
              <InfoIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Due":
            buttonColor = "#FF9800"; // Orange
            buttonIcon = (
              <WarningIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Overdue":
            buttonColor = "#F44336"; // Red
            buttonIcon = (
              <ErrorIcon style={{ color: "#fff", fontSize: "14px" }} />
            );
            break;

          case "Finished":
            buttonColor = "#9E9E9E"; // Deep Purple for Completed
            buttonIcon = (
              <CheckCircleIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            label = "Completed";
            break;

          default:
            buttonColor = "#9E9E9E"; // Grey fallback
            buttonIcon = (
              <ThumbUp style={{ color: "#fff", fontSize: "14px" }} />
            );
        }

        return (
          <StyledButton
            variant="contained"
            startIcon={buttonIcon}
            size="small"
            style={{
              backgroundColor: buttonColor,
              color: "#fff",
            }}
          >
            {label}
          </StyledButton>
        );
      },
    },
    {
      field: "dueDate",
      headerName: "Challan Due Date",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.value;
        const status = params.row.status;
        return value !== null && value !== undefined && value !== "" ? (
          value
        ) : status === "Finished" ? (
          "-"
        ) : (
          <span style={{ color: "red" }}>no date</span>
        );
      },
    }, // Hide on small screens
    {
      field: "viewProjection",
      headerName: "View Projection",
      width: 150,
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Box
            onClick={() => handleViewProjection(params.row.rawApplicationId)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#0a5a39",
              backgroundColor: "#aaa",
              padding: "4px 6px ",
              borderRadius: "6px",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <Visibility sx={{ mr: 0.5, fontSize: "16px" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
              View
            </Typography>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxHeight: "100%", px: { xs: 3, sm: 1 } }}>
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          marginBottom: 3,
          padding: 2,
          backgroundColor: cardBg, // Card background for filters/button
          borderRadius: "8px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <TextField
          label="Search by Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined" // Changed to outlined for consistency
          size="small"
          sx={{
            width: { xs: "100%", sm: "50%" },
            "& .MuiOutlinedInput-root": {
              color: textColor,
              "& fieldset": { borderColor: textColor },
              "&:hover fieldset": { borderColor: accentColor },
              "&.Mui-focused fieldset": { borderColor: accentColor },
            },
            "& .MuiInputLabel-root": {
              color: textColor,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: accentColor,
            },
          }}
        />

        <FormControl
          size="small"
          variant="outlined" // Changed to outlined for consistency
          sx={{
            width: { xs: "100%", sm: "30%" },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            label="Status"
            sx={{
              color: textColor,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: textColor,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: accentColor,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: accentColor,
              },
              "& .MuiSvgIcon-root": { color: textColor }, // Dropdown arrow color
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Due">Due</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Finished">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data Grid */}
      {loading ? (
        <Box
          sx={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            style={{ color: accentColor }}
          />{" "}
          <span style={{ fontSize: "14px", color: "#333" }}>
            Loading Projections...
          </span>
        </Box>
      ) : error ? (
        <Box textAlign="center" py={2} color="red">
          {error}
        </Box>
      ) : (
        <StyledDataGrid
          rows={filteredStudents}
          density="compact"
          columns={columns}
          pageSize={10}
          loading={loading}
          rowsPerPageOptions={[5, 10, 20]}
          components={{
            Toolbar: () => (
              <CustomToolbar
                selectedRows={filteredStudents}
                // handleExport={handleExport}
              />
            ),
          }}
          rowHeight={null} // Let row height be dynamic
          getRowHeight={() => "auto"}
          sx={{
            height: "420px", // Adjusted height for consistency
            minWidth: "300px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}
    </Box>
  );
};

export default ProjectionDashboard1;
