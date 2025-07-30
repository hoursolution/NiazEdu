import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Tooltip,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "./StudentProjectionSheetTable.module.css";
import FileUploadDialog from "./FileUploadDialog";
import { styled, useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { RiFundsBoxFill, RiFundsBoxLine } from "react-icons/ri";
import { MdAttachMoney, MdPendingActions } from "react-icons/md";
import DescriptionIcon from "@mui/icons-material/Description"; // Challan
import AssessmentIcon from "@mui/icons-material/Assessment"; // Result
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Receipt
import FolderIcon from "@mui/icons-material/Folder"; // Other Documents

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

const StudentProjectionSheetTable = (studentId) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [latestApplication, SetLatestApplication] = useState(null);

  const [editRow, setEditRow] = useState(null);
  const [originalRow, setOriginalRow] = useState(null); // Store original row data
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [documentType, setDocumentType] = useState("");
  // const [studentId, setStudentId] = useState("");
  const [projections, setProjections] = useState([]);
  const [isChallanSelected, setIsChallanSelected] = useState(false);
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalPaid: 0,
    remainingBalance: 0,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  // Function to fetch projections and update table data
  const fetchStudentProjections = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedStudentId = localStorage.getItem("studentId");

      if (!token || !storedStudentId) {
        console.error("Missing token or studentId.");
        return;
      }

      // Step 1: Fetch student details (with applications)
      const studentRes = await fetch(
        `${BASE_URL}/api/studentDetails/${storedStudentId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!studentRes.ok) {
        throw new Error("Failed to fetch student details.");
      }

      const studentData = await studentRes.json();

      if (!studentData.applications || studentData.applications.length === 0) {
        console.warn("No applications found for student.");
        return;
      }

      // Step 2: Get the latest application
      const latestApplication =
        studentData.applications[studentData.applications.length - 1];

      SetLatestApplication(latestApplication);

      // Step 4: Sort and enhance projection data
      const sortedProjections = (latestApplication.projections || []).sort(
        (a, b) => {
          if (a.semester_number !== b.semester_number) {
            return a.semester_number - b.semester_number;
          }
          const dateA = new Date(a.Projection_ending_date || "9999-12-31");
          const dateB = new Date(b.Projection_ending_date || "9999-12-31");
          return dateA - dateB;
        }
      );

      const updatedProjections = sortedProjections.map((item) => {
        const currentDate = new Date();
        const due = item.challan_due_date
          ? new Date(item.challan_due_date)
          : null;
        const paid = item.challan_payment_date
          ? new Date(item.challan_payment_date)
          : null;

        if (paid) item.status = "Paid";
        else if (due && due < currentDate) item.status = "Overdue";
        else if (due && due >= currentDate) item.status = "Due";
        else item.status = item.status || "NYD";

        return item;
      });

      // Step 5: Calculate totals
      let totalAmount = 0,
        totalPaid = 0;
      updatedProjections.forEach((item) => {
        const amount = parseFloat(item.total_amount || 0);
        totalAmount += amount;
        if (item.status === "Paid") totalPaid += amount;
      });

      const remainingBalance = totalAmount - totalPaid;

      // Step 6: Set state
      setStudentData(studentData); // Full student data
      setProjections(updatedProjections);
      setTotals({
        totalAmount: totalAmount.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
      setRows(
        updatedProjections.map((item, index) => ({
          id: index + 1,
          ...item,
        }))
      );
    } catch (error) {
      console.error("Error fetching projections from application:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data when the component mounts or ID changes
  useEffect(() => {
    if (studentId) {
      fetchStudentProjections();
    }
  }, [studentId]);

  const handleEdit = (row) => {
    setEditRow(row);
    setOriginalRow({ ...row }); // Store original values
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setSelectedFiles((prevFiles) => ({ ...prevFiles, [fileType]: file }));

    if (fileType === "challan") {
      setIsChallanSelected(true); // Challan is selected
    }
  };

  const handleOpenModal = (url, type) => {
    setFileUrl(url);
    setDocumentType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFileUrl(null);
  };
  const handleFormSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not available.");
        return;
      }
      // Check if Challan is selected and Challan Amount/Due Date are empty
      if (isChallanSelected) {
        if (!editRow?.actual_amount_of_challan || !editRow?.challan_due_date) {
          alert("Please provide both Challan Amount and Challan Due Date.");
          return;
        }
      }
      const formData = new FormData();
      // Only append fields that have changed or are required
      // Append non-file fields from editRow
      for (const key in editRow) {
        if (
          ![
            "challan",
            "receipt",
            "payment_receipt",
            "result",
            "other_documents",
          ].includes(key)
        ) {
          formData.append(key, editRow[key] || "");
        }
      }

      Object.keys(selectedFiles).forEach((fileType) => {
        if (selectedFiles[fileType]) {
          // If the file exists, append it
          formData.append(fileType, selectedFiles[fileType]);
        }
      });
      console.log(formData);
      const response = await axios.patch(
        `${BASE_URL}/projections/${editRow.id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === editRow.id ? { ...row, ...editRow } : row
          )
        );
        // Refresh the table after a successful submission
        await fetchStudentProjections();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating projection:", error);
    }
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const handleViewDocument = (row, documentType) => {
    let url = "";
    switch (documentType) {
      case "challan":
        url = row.challan; // Assuming `row.challan_document_url` holds the URL
        break;
      case "receipt":
        url = row.receipt; // Assuming `row.receipt_document_url` holds the URL
        break;
      case "payment_receipt":
        url = row.payment_receipt; // Assuming `row.receipt_document_url` holds the URL payment_receipt
        break;
      case "result":
        url = row.result; // Assuming `row.result_document_url` holds the URL
        break;
      case "other_documents":
        url = row.other_documents; // Assuming `row.other_document_url` holds the URL
        break;
      default:
        console.error("Unknown document type:", documentType);
        return;
    }

    handleOpenModal(url, documentType);
  };

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
      field: "semester_number",
      headerName: "Semester",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "education_fee_contribution",
    //   headerName: "Education Fee Contribution",
    //   width: 180,
    //   valueFormatter: (params) => parseFloat(params.value || 0).toFixed(0), // Ensures two decimal places
    // },
    // {
    //   field: "other_cost_contribution",
    //   headerName: "Other Cost Contribution",
    //   width: 180,
    //   valueFormatter: (params) => parseFloat(params.value || 0).toFixed(0), // Ensures two decimal places
    // },
    // {
    //   field: "admission_fee_contribution",
    //   headerName: "Admission Fee Contribution",
    //   width: 200,
    //   // valueFormatter: (params) => parseFloat(params.value || 0).toFixed(2), // Ensures two decimal places
    // },
    {
      field: "total_amount",
      headerName: "Total Amount Contribution",
      width: 140,
      valueFormatter: (params) => parseFloat(params.value || 0).toFixed(0), // Ensures two decimal places
    },

    ,
    {
      field: "percentage",
      headerName: "Percentage(%)",
      flex: 1,
      minWidth: 105,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        const raw = params.row.percentage;
        if (!raw) return "N/A";

        const cleaned = raw.replace(/Sponsor \d+:\s*/g, "").split(",");
        const rounded = cleaned.map((p) => Math.round(parseFloat(p)));

        if (rounded.length === 1 || (rounded[1] && rounded[1] > 0)) {
          return rounded
            .filter((v) => v > 0)
            .map((v) => `${v}%`)
            .join(", ");
        } else {
          return `${rounded[0]}%`;
        }
      },
    },
    {
      field: "Projection_ending_date",
      headerName: "Estimated Date Of Payment",
      width: 160,
    },
    {
      field: "actual_amount_of_challan",
      headerName: "Actual Amount Of Challan",
      width: 160,
    },
    { field: "challan_date", headerName: "Challan Date", width: 160 },
    {
      field: "challan",
      headerName: "Challan",
      width: 80,
      renderCell: (params) =>
        params.row.challan ? (
          <Tooltip title="View Challan">
            <IconButton
              color="info"
              onClick={() => handleViewDocument(params.row, "challan")}
            >
              <DescriptionIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Not Uploaded">
            <Typography variant="body2" color="error">
              <ErrorOutlineIcon />
            </Typography>
          </Tooltip>
        ),
    },
    { field: "challan_due_date", headerName: "Challan Due Date", width: 160 },
    { field: "challan_payment_date", headerName: "Payment Date", width: 160 },
    {
      field: "receipt",
      headerName: "Receipt ",
      width: 80,
      renderCell: (params) =>
        params.row.receipt ? (
          <Tooltip title="View Receipt">
            <IconButton
              color="success"
              onClick={() => handleViewDocument(params.row, "receipt")}
            >
              <ReceiptLongIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Not Uploaded">
            <Typography variant="body2" color="error">
              <ErrorOutlineIcon />
            </Typography>
          </Tooltip>
        ),
    },
    {
      field: "payment_receipt",
      headerName: "payment Receipt ",
      width: 80,
      renderCell: (params) =>
        params.row.payment_receipt ? (
          <Tooltip title="View Receipt">
            <IconButton
              color="success"
              onClick={() => handleViewDocument(params.row, "payment_receipt")}
            >
              <ReceiptLongIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Not Uploaded">
            <Typography variant="body2" color="error">
              <ErrorOutlineIcon />
            </Typography>
          </Tooltip>
        ),
    },
    { field: "status", headerName: "Status", width: 150 },

    // {
    //   field: "result",
    //   headerName: "Result",
    //   width: 80,
    //   renderCell: (params) =>
    //     params.row.result ? (
    //       <Tooltip title="View Result">
    //         <IconButton
    //           color="warning"
    //           onClick={() => handleViewDocument(params.row, "result")}
    //         >
    //           <AssessmentIcon />
    //         </IconButton>
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title="Not Uploaded">
    //         <Typography variant="body2" color="error">
    //           <ErrorOutlineIcon />
    //         </Typography>
    //       </Tooltip>
    //     ),
    // },
    // {
    //   field: "other_documents",
    //   headerName: "Other Documents",
    //   width: 130,
    //   renderCell: (params) =>
    //     params.row.other_documents ? (
    //       <Tooltip title="View Other Documents">
    //         <IconButton
    //           color="secondary"
    //           onClick={() => handleViewDocument(params.row, "other_documents")}
    //         >
    //           <FolderIcon />
    //         </IconButton>
    //       </Tooltip>
    //     ) : (
    //       <Tooltip title="Not Uploaded">
    //         <Typography variant="body2" color="error">
    //           <ErrorOutlineIcon />
    //         </Typography>
    //       </Tooltip>
    //     ),
    // },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleEdit(params.row)}
            className="btn btn-sm btn-primary"
          >
            Edit
          </button>
        </>
      ),
    },
  ];
  // style cards
  const boxStyle = {
    flex: "1 1 240px",
    minWidth: "220px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
    borderRadius: "12px",
    padding: "5px",
    textAlign: "center",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    color: "#fff",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.15)",
    },
  };

  const renderBox = (icon, title, value, onClick, customStyle = {}) => (
    <Box
      sx={{ ...boxStyle, ...customStyle, height: "100px" }}
      onClick={onClick}
    >
      <Box sx={{ mb: 1 }}>{icon}</Box>
      <Typography sx={{ fontSize: "12px", color: "#000", fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontSize: "14px", color: "#000", fontWeight: "bold", mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );
  return (
    <Box sx={{ width: "100%", maxHeight: "100%", px: { xs: 3, sm: 1 } }}>
      {studentId && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
            gap: 2,
            padding: "5px",
            marginBottom: "20px",
          }}
        >
          {/* Student info*/}
          <Box
            sx={{
              ...boxStyle,

              background: "linear-gradient(135deg, #263238, #37474f)",
              alignItems: "center",
              flexDirection: "row",
              gap: 1.6,
            }}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Profile pic"
                src={latestApplication?.profile_picture}
                sx={{ width: 60, height: 60, marginLeft: "8px" }}
              />
            </StyledBadge>
            <Box
              sx={{
                flex: { xs: "100%", sm: 1.5 },
                minWidth: 200,
                display: "flex",
                gap: 0.4,
                flexDirection: "column",
              }}
            >
              {/* name */}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", wordBreak: "break-word" }}
              >
                {latestApplication?.name
                  ? latestApplication.name.toUpperCase()
                  : ""}{" "}
                {latestApplication?.status && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.6rem",
                      color:
                        latestApplication.status.toLowerCase() === "accepted"
                          ? "#44b700"
                          : "red",
                    }}
                  >
                    ({latestApplication.status})
                  </Typography>
                )}
              </Typography>

              {/* details */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: "8px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {latestApplication?.mobile_no || "N/A"} |{" "}
                {latestApplication?.email || "N/A"} |{" "}
                {latestApplication?.city || "N/A"}
              </Typography>

              {/* collage */}
              <Typography
                variant="body1"
                sx={{
                  // fontWeight: "bold",
                  fontSize: "10px",
                  wordBreak: "break-word",
                }}
              >
                {/* Collage:{" "} */}
                {latestApplication?.institution_interested_in}
              </Typography>

              {/* proram */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: "10px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {/* Program:{" "} */}
                {latestApplication?.program_interested_in?.toUpperCase()}{" "}
              </Typography>
            </Box>
          </Box>

          {/* Metrics Boxes */}
          <Box>
            {renderBox(
              <LiaMoneyCheckAltSolid size={36} color="green" />,
              <span className="font-bold text-sm ">
                Total Amount Sponsored (PKR)
              </span>,
              <Typography sx={{ fontWeight: "bold" }} color="green">
                {parseFloat(totals.totalAmount).toLocaleString()}
              </Typography>,
              () => navigate("#"),
              {
                background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
              }
            )}
          </Box>

          <Box>
            {renderBox(
              <RiFundsBoxLine size={34} color="#2e7d32" />,

              <span className="font-bold text-sm ">
                Total Donated So Far (PKR)
              </span>,
              <Typography sx={{ fontWeight: "bold" }} color="success.main">
                {parseFloat(totals.totalPaid).toLocaleString()}
              </Typography>,
              () => navigate("#"),
              {
                background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", // light green
              }
            )}
          </Box>

          <Box>
            {renderBox(
              <MdPendingActions size={34} color="#2e7d32" />,

              <span className="font-bold text-sM ">
                Remaining Sponsorship (PKR)
              </span>,
              <Typography sx={{ fontWeight: "bold" }} color="success.main">
                {parseFloat(totals.remainingBalance).toLocaleString()}
              </Typography>,
              () => navigate("#"),
              {
                background: "linear-gradient(135deg, #F1B9AA, #EB6959)", // light orange
              }
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ height: 400, width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <StyledDataGrid
            rows={rows}
            columns={columns}
            density="compact"
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        )}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Semester Number"
              name="semester_number"
              value={editRow?.semester_number || ""}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              margin="dense"
              label="Actual Amount of Challan"
              name="actual_amount_of_challan"
              type="number"
              value={editRow?.actual_amount_of_challan || ""}
              onChange={handleInputChange}
              fullWidth
              required={isChallanSelected} // Required only if Challan is selected
            />
            <TextField
              margin="dense"
              label="Challan  Date"
              name="challan_date"
              type="date"
              value={editRow?.challan_date || ""}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required={isChallanSelected} // Required only if Challan is selected
            />
            <InputLabel shrink>Challan</InputLabel>
            {editRow?.challan ? (
              <Button
                size="small"
                variant="contained"
                href={editRow.challan}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Challan
              </Button>
            ) : (
              <input
                type="file"
                name="challan"
                onChange={(e) => handleFileChange(e, "challan")}
                style={{ margin: "10px 0" }}
              />
            )}

            <TextField
              margin="dense"
              label="Challan Due Date"
              name="challan_due_date"
              type="date"
              value={editRow?.challan_due_date || ""}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              // required={isChallanSelected} // Required only if Challan is selected
            />
            <InputLabel shrink>Payment Receipt</InputLabel>
            {editRow?.payment_receipt ? (
              <Button
                size="small"
                variant="contained"
                href={editRow.payment_receipt}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Payment Receipt
              </Button>
            ) : (
              <input
                type="file"
                name="payment_receipt"
                onChange={(e) => handleFileChange(e, "payment_receipt")}
                style={{ margin: "10px 0" }}
              />
            )}

            {/* <InputLabel shrink> Receipt</InputLabel>
            {editRow?.receipt ? (
              <Button
                size="small"
                variant="contained"
                href={editRow.receipt}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Receipt
              </Button>
            ) : (
              <input
                type="file"
                name="receipt"
                onChange={(e) => handleFileChange(e, "receipt")}
                style={{ margin: "10px 0" }}
              />
            )}

            <TextField
              margin="dense"
              label="Challan Payment Date"
              name="challan_payment_date"
              type="date"
              value={editRow?.challan_payment_date || ""}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            /> */}

            <InputLabel shrink>Result</InputLabel>
            {editRow?.result ? (
              <Button
                size="small"
                variant="contained"
                href={editRow.result}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Result
              </Button>
            ) : (
              <input
                type="file"
                name="result"
                onChange={(e) => handleFileChange(e, "result")}
                style={{ margin: "10px 0" }}
              />
            )}

            <InputLabel shrink>Other Document</InputLabel>
            {editRow?.other_documents ? (
              <Button
                size="small"
                variant="contained"
                href={editRow.other_documents}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </Button>
            ) : (
              <input
                type="file"
                name="other_documents"
                onChange={(e) => handleFileChange(e, "other_documents")}
                style={{ margin: "10px 0" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>View {documentType} Document</DialogTitle>
          <DialogContent>
            {fileUrl ? (
              <iframe
                src={fileUrl}
                title="Document Viewer"
                width="100%"
                height="100%"
                frameBorder="0"
              ></iframe>
            ) : (
              <p>Loading...</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default StudentProjectionSheetTable;
