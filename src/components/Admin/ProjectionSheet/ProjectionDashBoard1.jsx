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

// custom toolbar for table
const CustomToolbar = ({ selectedRows, handleExport }) => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton sx={{ color: "#0c74a6" }} />{" "}
      <GridToolbarColumnsButton sx={{ color: "#0c74a6" }} />
      <GridToolbarDensitySelector sx={{ color: "#0c74a6" }} />
      {/* <Button
        sx={{
          fontSize: "14px",
          letterSpacing: 0.15,
          fontWeight: 500,
          textTransform: "none",
          color: selectedRows.length === 0 ? "gray" : "#fe6c6c",
          "&:hover": {
            color: selectedRows.length === 0 ? "gray" : "red",
            backgroundColor: "transparent",
          },
        }}
        disabled={selectedRows.length === 0}
        onClick={handleExport}
        startIcon={<CiExport />}
      >
        Export
      </Button> */}
    </GridToolbarContainer>
  );
};

// Custom styled DataGrid component
const StyledDataGrid = styled(DataGrid)({
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#263238",
    color: "white",
    fontSize: "13px",
    textTransform: "capitalize",
  },
  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "1px solid white",
    textAlign: "center",
    whiteSpace: "normal",
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
    borderLeft: "1px solid #aaa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    whiteSpace: "normal",
    wordWrap: "break-word",
    lineHeight: 1.4,
    padding: "6px",
    fontSize: "12px",
  },

  "& .MuiDataGrid-row": {
    "&:hover": {
      backgroundColor: "rgba(0, 128, 0, 0.02)",
    },
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

  // Fetch students with error handling
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/students/`);
      const today = new Date();

      const processedData = response.data
        .filter((student) => {
          const hasApplications =
            Array.isArray(student.applications) &&
            student.applications.length > 0;

          const hasProjections = student.applications?.some(
            (app) =>
              Array.isArray(app.projections) && app.projections.length > 0
          );

          const hasMatchingSelectDonor = student.applications?.some((app) =>
            student.selectDonor?.some?.((sd) => sd.application === app.id)
          );

          return (hasApplications && hasProjections) || hasMatchingSelectDonor;
        })
        .flatMap((student) => {
          const today = new Date();
          const applicationsSorted = [...student.applications].sort(
            (a, b) => a.id - b.id
          );

          const firstApp = applicationsSorted[0];
          const includeAll =
            firstApp.education_status &&
            firstApp.education_status === "Finished";

          // const appsToProcess = includeAll ? applicationsSorted : [firstApp]; // Only first if not finished

          // Progressive inclusion of applications based on education_status
          const appsToProcess = [];
          for (let i = 0; i < applicationsSorted.length; i++) {
            if (i === 0) {
              appsToProcess.push(applicationsSorted[i]);
            } else {
              const prevApp = applicationsSorted[i - 1];
              if (prevApp.education_status === "Finished") {
                appsToProcess.push(applicationsSorted[i]);
              } else {
                break;
              }
            }
          }

          return (
            appsToProcess
              // .filter((app) => app.projections?.length > 0)
              .map((app) => {
                const educationStatus = app.education_status || "N/A";
                const applicationId = app.id;

                const allProjections = app.projections.map((item) => {
                  const challanDueDate = item.challan_due_date
                    ? new Date(item.challan_due_date)
                    : null;
                  const challanPaymentDate = item.challan_payment_date
                    ? new Date(item.challan_payment_date)
                    : null;

                  if (challanPaymentDate) {
                    item.status = "Paid";
                  } else if (challanDueDate && challanDueDate < today) {
                    item.status = "Overdue";
                  } else if (challanDueDate && challanDueDate >= today) {
                    item.status = "Due";
                  } else {
                    item.status = item.status || "NYD";
                  }

                  return item;
                });

                // Select the relevant projection
                let selectedProjection;
                if (allProjections.length === 1) {
                  selectedProjection = allProjections[0];
                } else {
                  const upcoming = allProjections.filter(
                    (p) => new Date(p.Projection_ending_date) >= today
                  );
                  if (upcoming.length > 0) {
                    selectedProjection = upcoming.sort(
                      (a, b) =>
                        new Date(a.Projection_ending_date) -
                        new Date(b.Projection_ending_date)
                    )[0];
                  } else {
                    selectedProjection = [...allProjections].sort(
                      (a, b) =>
                        new Date(b.Projection_ending_date) -
                        new Date(a.Projection_ending_date)
                    )[0];
                  }
                }
                // Match the donor to the correct application
                const selectDonorForApp = student.selectDonor?.find?.(
                  (sd) => sd.application === app.id
                );
                const sponsorName =
                  selectDonorForApp?.donor?.donor_name || "N/A";

                // const latestProjection = selectedProjection || {};

                const latestProjection = selectedProjection || {};
                let cleanPercentage = `${latestProjection.percentage}`;
                if (latestProjection.percentage) {
                  const percentageStr = latestProjection.percentage;

                  let cleaned = [];

                  if (latestProjection.percentage) {
                    const percentageStr = latestProjection.percentage;

                    let cleaned = [];

                    if (percentageStr.includes("Sponsor")) {
                      // Format: "Sponsor 1: 33.3%, Sponsor 2: 66.7%"
                      cleaned = percentageStr
                        .split(",")
                        .map((entry) => {
                          const match = entry.match(
                            /(Sponsor \d+):\s*([\d.]+)%?/
                          );
                          if (match) {
                            const label = match[1];
                            const value = Math.round(parseFloat(match[2]));
                            return value > 0 ? `${value}%` : null;
                          }
                          return null;
                        })
                        .filter(Boolean);
                    } else {
                      // Format: "Education: 100.0%, Other: 0.0%"
                      cleaned = percentageStr
                        .split(",")
                        .map((entry) => {
                          const match = entry.match(/(.*?):\s*([\d.]+)%?/);
                          if (match) {
                            const label = match[1].trim();
                            const value = Math.round(parseFloat(match[2]));
                            return value > 0 ? `${value}%` : null;
                          }
                          return null;
                        })
                        .filter(Boolean);
                    }

                    if (cleaned.length > 0) {
                      cleanPercentage = cleaned.join(", ");
                    }
                  }

                  const validPercentages = cleaned.filter((val) => val > 0);

                  if (validPercentages.length > 0) {
                    cleanPercentage = validPercentages
                      .map((val) => `${val}%`)
                      .join(", ");
                  }
                }
                if (educationStatus === "Finished") {
                  return {
                    id: `${student.id}-${applicationId}`,
                    fullName: `${student.student_name} ${student.last_name}`,
                    sponsor: sponsorName,
                    semester: "",
                    amount: "",
                    percentage: "",
                    status: "Finished",
                    dueDate: "",
                    program: app.program_interested_in || "N/A",
                    rawApplicationId: applicationId,
                  };
                }

                return {
                  id: `${student.id}-${applicationId}`,
                  fullName: `${student.student_name || ""} ${
                    student.last_name || ""
                  }`,
                  sponsor: sponsorName,
                  semester: latestProjection.semester_number || "N/A",
                  amount: latestProjection.total_amount || "N/A",
                  percentage: cleanPercentage,
                  status: latestProjection.status || "Pending",
                  dueDate: latestProjection.challan_due_date
                    ? new Date(
                        latestProjection.challan_due_date
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })
                    : "N/A",
                  program: app.program_interested_in || "N/A",
                  rawApplicationId: applicationId,
                };
              })
          );
        });

      const sortedData = processedData.sort(
        (a, b) => a.rawApplicationId - b.rawApplicationId
      );

      setStudents(sortedData);
      setFilteredStudents(sortedData);
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
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "semester",
      headerName: "Semester/Months",
      flex: 1,
      minWidth: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "amount",
      headerName: "Current Total Amount",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
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
      // renderCell: (params) => (
      //   <Typography sx={{ fontSize: "12px" }} variant="body2">
      //     {params?.row?.due_date || (
      //       <span className="text-red-600 text-[12px]">no date</span>
      //     )}
      //   </Typography>
      // ),
    }, // Hide on small screens
    {
      field: "viewProjection",
      headerName: "View Projection",
      width: 150,
      flex: 1,
      minWidth: 130,
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
    <Box sx={{ width: "100%", maxHeight: 450, mt: 10, px: { xs: 3, sm: 1 } }}>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          flexWrap: "wrap", // Makes it responsive on smaller screens
          padding: "0px 20px",
        }}
      >
        <TextField
          label="Search by Name"
          variant="filled"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: "50%",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiFilledInput-root": {
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: "#FFFFFF",
              paddingTop: "6px",
              paddingBottom: "6px",
              height: "36px", // adjust height
              "&:before": {
                borderBottom: "none", // remove default bottom border
              },
              "&:after": {
                borderBottom: "none", // remove focused bottom border
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              top: "-6px",
            },
          }}
        />

        <FormControl
          size="small"
          variant="filled"
          sx={{
            width: "20%",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiFilledInput-root": {
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: "#FFFFFF",
              paddingTop: "6px",
              paddingBottom: "6px",
              height: "36px", // adjust height
              "&:before": {
                borderBottom: "none", // remove default bottom border
              },
              "&:after": {
                borderBottom: "none", // remove focused bottom border
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              top: "-6px",
            },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Due">Due</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Finished">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Data Grid */}
      {loading ? (
        <Box textAlign="center" py={2}>
          Loading...
        </Box>
      ) : error ? (
        <Box textAlign="center" py={2} color="red">
          {error}
        </Box>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap" }}>
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
              height: "450px",
              minWidth: "300px",
              boxShadow: 5,
              borderRadius: "10px",
              overflow: "hidden", // Hide internal scrollbars
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjectionDashboard1;
