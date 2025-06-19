import React, { useCallback, useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardTable.module.css";
import InvoicePopup from "./InvoicePopup";
import { borderRadius, padding, styled, textAlign } from "@mui/system";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { CircularProgress } from "@mui/material";
import Box2 from "./Box2";
import { ThumbUp } from "@mui/icons-material";
import { IoEye, IoEyeSharp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { CiExport } from "react-icons/ci";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import Invoice from "./Invoice";

import { Tooltip } from "@mui/material";

const CustomToolbar = ({ selectedRows, handleExport, selectedRowIds }) => {
  return (
    <GridToolbarContainer>
      <Tooltip title="Hide and Show Columns">
        <GridToolbarColumnsButton sx={{ color: "#0c74a6" }} />
      </Tooltip>

      <Tooltip title="Font Size">
        <span>
          <GridToolbarDensitySelector sx={{ color: "#0c74a6" }} />
        </span>
      </Tooltip>

      <Tooltip title="Export Report">
        <Button
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
          disabled={selectedRowIds.length === 0}
          onClick={handleExport}
          startIcon={<CiExport />}
        >
          Export
        </Button>
      </Tooltip>
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

const DashBoardTable = () => {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [isInvoicePopupOpen, setIsInvoicePopupOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  // filter due my months
  const [filterByMonth, setFilterByMonth] = useState("");

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const today = new Date();

  // state for export
  const [donorId, setDonorId] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [exportRows, setExportRows] = useState([]);

  const handleRowSelection = (selectionModel) => {
    setSelectedRowIds(selectionModel);

    const selectedData = exportRows.filter((row) =>
      selectionModel.includes(row.id)
    );

    setSelectedRows(selectedData);

    console.log("✅ Selected Rows:", selectedRowIds); // Console log selected row data
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not available.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/donorStudents/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          const mappedData = data.flatMap((student) => {
            if (!student.applications?.length) return [];

            return student.applications.map((application) => {
              const allProjections = application.projections || [];
              const educationStatus = application.education_status || "N/A";
              const today = new Date();
              let selectedProjection;

              if (allProjections.length === 1) {
                selectedProjection = allProjections[0]; // Only one, return it
              } else {
                const upcoming = allProjections.filter(
                  (p) => new Date(p.Projection_ending_date) >= today
                );

                if (upcoming.length > 0) {
                  // Pick the soonest upcoming projection
                  selectedProjection = upcoming.sort(
                    (a, b) =>
                      new Date(a.Projection_ending_date) -
                      new Date(b.Projection_ending_date)
                  )[0];
                } else {
                  // All are in the past — pick the last one
                  selectedProjection = [...allProjections].sort(
                    (a, b) =>
                      new Date(b.Projection_ending_date) -
                      new Date(a.Projection_ending_date)
                  )[0];
                }
              }

              const latestProjection = selectedProjection || {};

              // Determine projection status
              const getProjectionStatus = (item) => {
                const challanDueDate = item.challan_due_date
                  ? new Date(item.challan_due_date)
                  : null;
                const challanPaymentDate = item.challan_payment_date
                  ? new Date(item.challan_payment_date)
                  : null;
                const currentDate = new Date();

                if (challanPaymentDate) {
                  return "Paid";
                } else if (challanDueDate && challanDueDate < currentDate) {
                  return "Overdue";
                } else if (challanDueDate && challanDueDate >= currentDate) {
                  return "Due";
                } else {
                  return "NYD"; // Not Yet Defined
                }
              };

              const startDate = new Date(
                latestProjection.Projection_starting_date
              );
              const endDate = new Date(latestProjection.Projection_ending_date);

              if (
                latestProjection.Projection_starting_date &&
                latestProjection.Projection_ending_date
              ) {
                if (endDate < today) statusLabel = "Completed";
                else if (startDate > today) statusLabel = "Upcoming";
                else statusLabel = "Ongoing";
              }
              // Format percentage field (remove "Sponsor X:" and decimals)
              let cleanPercentage = "N/A";
              if (latestProjection.percentage) {
                const cleaned = latestProjection.percentage
                  .replace(/Sponsor \d+:\s*/g, "")
                  .split(",")
                  .map((p) => Math.round(parseFloat(p)));

                // Include only if the value is greater than 0
                const validPercentages = cleaned.filter((val) => val > 0);

                if (validPercentages.length > 0) {
                  cleanPercentage = validPercentages
                    .map((val) => `${val}%`)
                    .join(", ");
                }
              }
              const applicationId = student.applications?.[0]?.id || 0;
              if (educationStatus === "Finished") {
                return {
                  id: application.id,
                  studentId: student.id,
                  fullName: `${student.student_name} ${student.last_name}`,

                  semester: "",
                  amount: "",
                  percentage: "",
                  status: "Finished",
                  dueDate: "",

                  program: application.program_interested_in || "N/A",
                  rawApplicationId: applicationId,
                };
              }
              return {
                id: application.id,
                studentId: student.id,
                fullName: `${student.student_name} ${student.last_name}`,
                donorEmail: student.email || "N/A",
                sponsor: latestProjection.sponsor_name || "No sponsor info",
                semester: latestProjection.semester_number || "N/A",
                amount: latestProjection.total_amount
                  ? `${Math.round(latestProjection.total_amount)} `
                  : "No recent amount",
                percentage: cleanPercentage,
                status: getProjectionStatus(latestProjection),
                dueDate: latestProjection.challan_due_date || "N/A",
                education: student.educationstatus?.status || "N/A",
                program: application.program_interested_in || "N/A",
                rawApplicationId: applicationId,
              };
            });
          });

          // ✅ Sort by rawApplicationId (ascending)
          const sortedData = mappedData.sort(
            (a, b) => a.rawApplicationId - b.rawApplicationId
          );

          setStudentsData(sortedData);
          setFilteredStudents(sortedData);
        } else {
          console.error("Invalid data format or empty array:", data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // for get donor data for export
  useEffect(() => {
    const fetchExport = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not available.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/donor-report/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            student_ids: selectedRowIds, // assuming it's an array like [1, 2, 3]
          }),
        });

        const data = await response.json();
        console.log(data);
        setExportRows(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExport();
  }, [selectedRowIds]);

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

  const CustomHeader = styled("div")({
    backgroundColor: "#14475a",
    color: "#fff",
    padding: "4px 16px",
    borderRadius: "8px 8px 0 0",
    textAlign: "center",
  });

  // Define handleProjectionsheetClick using useCallback
  const handleStudentDetailButtonClick = useCallback(
    (buttonType, applicationId, studentId) => {
      navigate("studentDetail", {
        state: { studentId, applicationId },
      });
    },
    [navigate]
  );
  const handleBankDetailButtonClick = useCallback(
    (buttonType, applicationId, studentId) => {
      navigate(`bankDetails/${studentId}`, {
        state: { applicationId },
      });
    },
    [navigate]
  );

  const handleProjectionButtonClick = useCallback(
    (studentId) => {
      // Example: navigate to a student details page with student data as state
      navigate(`/donor/studentallprojections/${studentId}`);
    },
    [navigate]
  );

  useEffect(() => {
    let filtered = studentsData;

    // Apply Search
    if (searchText) {
      filtered = filtered.filter((student) =>
        student.fullName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply Status Filter
    if (filterByStatus) {
      filtered = filtered.filter(
        (student) =>
          student.status.toLowerCase() === filterByStatus.toLowerCase()
      );
    }

    // Apply Month Filter (only for "Due" status)
    if (filterByMonth) {
      filtered = filtered.filter((student) => {
        const statusMatch = student.status.toLowerCase() === "due";

        const dueDate = new Date(student.dueDate);
        const selectedMonth = new Date(`${filterByMonth} 1`);
        const monthMatch =
          dueDate.getMonth() === selectedMonth.getMonth() &&
          dueDate.getFullYear() === selectedMonth.getFullYear();

        return statusMatch && monthMatch;
      });
    }

    // Apply Semester Filter
    if (filterBySemester) {
      filtered = filtered.filter(
        (student) => student.semester === parseInt(filterBySemester)
      );
    }

    setFilteredStudents(filtered);
  }, [
    searchText,
    filterByStatus,
    filterBySemester,
    filterByMonth,
    studentsData,
  ]);

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      headerAlign: "center",
      align: "center",
      width: 40,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
      },
    },
    {
      field: "fullName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "program",
      headerName: "Program",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "semester",
      headerName: "Month/Semester Current",
      flex: 1,
      minWidth: 125,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "percentage",
      headerName: "Sponsor(%)",
      flex: 1,
      minWidth: 85,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "amount",
      headerName: "Current Total Amount",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography sx={{ fontSize: "11px" }} variant="body2">
          {params?.row?.dueDate || (
            <span className="text-red-600 text-[12px]">no date</span>
          )}
        </Typography>
      ),
    },

    {
      field: "Fee Status",
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
      field: "Projection",
      headerName: "Projection",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" width="100%">
          <StyledButton
            startIcon={<InsertChartOutlinedIcon />}
            variant="contained"
            size="small"
            sx={{
              color: "#FFFFFF",
              fontSize: "10px",
              minWidth: "80px",
              borderRadius: "20px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#1976D2", // Material UI Blue 700
              "&:hover": {
                backgroundColor: "#1565C0", // Slightly darker hover effect
              },
            }}
            onClick={() => handleProjectionButtonClick(params.row.id)}
          >
            view
          </StyledButton>
        </Box>
      ),
    },
    {
      field: "Bank Detail",
      headerName: "Bank Details",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          {/* Button for Student Details */}
          <StyledButton
            startIcon={<AccountBalanceIcon sx={{ fontSize: "14px" }} />}
            variant="contained"
            color="success"
            size="small"
            sx={{
              backgroundColor: "#7CB342",
              color: "#1E1E1E",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#8BC34A ", // Hover effect
              },
            }}
            onClick={() =>
              handleBankDetailButtonClick(
                "Student Details",
                params.row.id, // applicationId
                params.row.studentId // studentId
              )
            }
          >
            <span className="button-text font-bold">view</span>
          </StyledButton>
        </Box>
      ),
    },

    {
      field: "Student Details",
      headerName: "Student Details",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          {/* Button for Student Details */}

          <StyledButton
            startIcon={<FaRegEye />}
            variant="contained"
            color="primary"
            size="small"
            sx={{
              backgroundColor: "#E0F2F1", // Light teal (calm and friendly)
              color: "#004D40", // Dark teal text for contrast
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#B2DFDB", // Slightly deeper hover color
              },
            }}
            onClick={() =>
              handleStudentDetailButtonClick(
                "Student Details",
                params.row.id, // applicationId
                params.row.studentId // studentId
              )
            }
          >
            view
          </StyledButton>
        </Box>
      ),
    },
  ];

  // export pdf
  const handleExport = () => {
    const doc = new jsPDF();
    const {
      total_sponsored_amount,
      remaining_sponsorship_amount,
      total_students,
      completed_students_count,
      in_progress_students_count,
      completed_students,
      ongoing_students,
    } = exportRows;

    // Header Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(20, 133, 129);
    doc.text("Sponsorship Summary", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    let summaryY = 30;
    doc.text(
      `Total Sponsored Amount (PKR):   ${parseFloat(
        total_sponsored_amount
      ).toLocaleString()}`,
      14,
      summaryY
    );
    doc.text(
      `Remaining Sponsorship Amount (PKR):   ${parseFloat(
        remaining_sponsorship_amount
      ).toLocaleString()}`,
      14,
      summaryY + 7
    );
    doc.text(`Total Students:   ${total_students}`, 14, summaryY + 14);
    doc.text(
      `Completed Students:   ${completed_students_count}`,
      14,
      summaryY + 21
    );
    doc.text(
      `Ongoing Students:   ${in_progress_students_count}`,
      14,
      summaryY + 28
    );

    let currentY = summaryY + 46;

    const generateStudentTable = (
      title,
      students,
      startY,
      isCompleted = false
    ) => {
      if (!students?.length) return startY;

      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text(title, 14, startY);

      const head = isCompleted
        ? [
            [
              "Student Name",
              "Program",
              "Semester / Months",
              "Start Payment Date",
              "Last Payment Date",
              "Last Payment Due Date",
              "Total Scholarship Amount Paid",
            ],
          ]
        : [
            [
              "Student Name",
              "Program",
              "Semester / Months",
              "Start Payment Date",
              "Last Payment Date",
              "Last Payment Due Date",
              "Total Amount",
              "Paid Amount",
              "Remaining",
            ],
          ];

      const rows = students.map((s) =>
        isCompleted
          ? [
              s.student_name,
              s.program,
              s.semester,
              s.start_payment_date || "no date",
              s.last_payment_date || "no date",
              s.upcoming_due_date || "no date",
              parseFloat(s.total_paid || 0).toLocaleString(),
            ]
          : [
              s.student_name,
              s.program,
              s.semester,
              s.start_payment_date || "no date",
              s.last_payment_date || "no date",
              s.upcoming_due_date || "no date",
              parseFloat(s.total_amount || 0).toLocaleString(),
              parseFloat(s.total_paid || 0).toLocaleString(),
              parseFloat(s.remaining || 0).toLocaleString(),
            ]
      );

      autoTable(doc, {
        startY: startY + 6,
        head,
        body: rows,
        styles: {
          fontSize: 8,
          overflow: "linebreak",
          halign: "center",
          valign: "middle",
        },
        headStyles: {
          fontSize: 7,
          halign: "center",
          valign: "middle",
          cellPadding: 2,
          lineWidth: 0.1,
          textColor: 255,
          fillColor: [20, 133, 129],
        },
        theme: "grid",
      });

      return doc.lastAutoTable.finalY + 10;
    };

    // Add Completed Students Table with updated columns
    currentY = generateStudentTable(
      "Completed Students:",
      completed_students,
      currentY,
      true // completed = true
    );

    // Add Ongoing Students Table (unchanged)
    generateStudentTable("Ongoing Students:", ongoing_students, currentY + 10);

    doc.save("sponsorship-summary.pdf");
  };

  // Generate month options
  const getNextThreeMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      months.push(monthYear);
    }
    return months;
  };

  const monthOptions = getNextThreeMonths();

  return (
    <div style={{ height: 500, width: "100%", marginTop: 0 }}>
      <Box2 />
      <div className=" border-gray-300 border-b-[1px] mt-4 mb-5" />
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
        {/* search filter */}
        <TextField
          label="Search by Name"
          variant="filled"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            width: "40%",
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

        {/* filter by status */}
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

        {/* filter by months */}
        <FormControl
          size="small"
          variant="filled"
          sx={{
            width: "30%",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiFilledInput-root": {
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: "#FFFFFF",
              paddingTop: "6px",
              paddingBottom: "6px",
              height: "36px",
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              top: "-6px",
            },
          }}
        >
          <InputLabel>Due By Month</InputLabel>
          <Select
            value={filterByMonth}
            onChange={(e) => setFilterByMonth(e.target.value)}
            label="Month"
          >
            <MenuItem value="">All</MenuItem>
            {monthOptions.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Main table */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          paddingX: "6px",
        }}
      >
        <Box sx={{ flexGrow: 1, width: "98%" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <StyledDataGrid
              rows={filteredStudents}
              density="compact"
              columns={columns}
              pageSize={10}
              loading={loading}
              checkboxSelection // ✅ Show checkboxes
              onRowSelectionModelChange={handleRowSelection} // ✅ Track selection
              rowsPerPageOptions={[5, 10, 20]}
              rowHeight={null} // Let row height be dynamic
              getRowHeight={() => "auto"}
              components={{
                Toolbar: () => (
                  <CustomToolbar
                    selectedRows={filteredStudents}
                    handleExport={handleExport}
                    selectedRowIds={selectedRowIds}
                  />
                ),
              }}
              sx={{
                height: "310px",
                minWidth: "300px",
                boxShadow: 5,
                borderRadius: "10px",
                overflow: "hidden", // Hide internal scrollbars
              }}
            />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default DashBoardTable;
