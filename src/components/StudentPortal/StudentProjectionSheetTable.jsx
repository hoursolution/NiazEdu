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
} from "@mui/material";
import axios from "axios";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "./StudentProjectionSheetTable.module.css";
import FileUploadDialog from "./FileUploadDialog";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionIcon from "@mui/icons-material/Description"; // Challan
import AssessmentIcon from "@mui/icons-material/Assessment"; // Result
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Receipt
import FolderIcon from "@mui/icons-material/Folder"; // Other Documents

const StudentProjectionSheetTable = (studentId) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

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
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  // Function to fetch projections and update table data
  const fetchStudentProjections = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedStudentId = localStorage.getItem("studentId");
      if (!token || !storedStudentId) {
        console.error("Token not available or missing studentId.");
        return;
      }
      // setStudentId(storedStudentId);

      const response = await fetch(
        `${BASE_URL}/api/students/${storedStudentId}/projections/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student projections.");
      }

      const data = await response.json();
      // Sort projections by semester_number in ascending order
      const sortedProjections = (data.projection || []).sort((a, b) => {
        // Primary sort: By semester_number
        if (a.semester_number !== b.semester_number) {
          return a.semester_number - b.semester_number;
        }

        // Secondary sort: By Projection_ending_date (parse to Date for comparison)
        const dateA = new Date(a.Projection_ending_date || "9999-12-31"); // Default far future date for missing values
        const dateB = new Date(b.Projection_ending_date || "9999-12-31");
        return dateA - dateB;
      });
      // Check if the challan due date is past, and if so, update the status to "Overdue"
      // Check if the challan due date is past and receipt is not available, update status to "Overdue"
      const updatedProjections = sortedProjections.map((item) => {
        const challanDate = item.challan_date
          ? new Date(item.challan_date)
          : null;
        const challanDueDate = item.challan_due_date
          ? new Date(item.challan_due_date)
          : null;
        const challanPaymentDate = item.challan_payment_date
          ? new Date(item.challan_payment_date)
          : null;
        const currentDate = new Date();

        if (challanPaymentDate) {
          // If payment date is available, status is "Paid"
          item.status = "Paid";
        } else if (challanDueDate && challanDueDate < currentDate) {
          // If the due date is in the past and no payment date, status is "Overdue"
          item.status = "Overdue";
        } else if (challanDueDate && challanDueDate >= currentDate) {
          // If the due date is in the future and no payment date, status is "Due"
          item.status = "Due";
        }
        // else if (challanDate && !challanDueDate) {
        // If a challan is uploaded but no due date is specified
        // item.status = "Challan Uploaded";
        // }
        else {
          // If no dates are present, set a default status
          item.status = item.status || "NYD";
        }

        return item;
      });
      // Calculate total amount and total paid
      let totalAmount = 0;
      let totalPaid = 0;

      sortedProjections.forEach((item) => {
        const itemTotal = parseFloat(item.total_amount || 0);

        totalAmount += itemTotal; // Sum up total amounts
        if (item.status === "Paid") {
          totalPaid += itemTotal; // Sum up amounts with status "Paid"
        }
      });

      const remainingBalance = totalAmount - totalPaid;
      // console.log(totalAmount);
      // console.log(totalPaid);
      // console.log(remainingBalance);

      setStudentData(data);
      setProjections(updatedProjections);
      setTotals({
        totalAmount: totalAmount.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
      setRows(
        updatedProjections.map((item, index) => ({
          id: index + 1, // Ensure a stable ID
          ...item,
        }))
      );
    } catch (error) {
      console.error("Error fetching student projections:", error);
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
    { field: "semester_number", headerName: "Semester", width: 80 },
    {
      field: "education_fee_contribution",
      headerName: "Education Fee Contribution",
      width: 180,
      valueFormatter: (params) => parseFloat(params.value || 0).toFixed(0), // Ensures two decimal places
    },
    {
      field: "other_cost_contribution",
      headerName: "Other Cost Contribution",
      width: 180,
      valueFormatter: (params) => parseFloat(params.value || 0).toFixed(0), // Ensures two decimal places
    },
    {
      field: "admission_fee_contribution",
      headerName: "Admission Fee Contribution",
      width: 200,
      // valueFormatter: (params) => parseFloat(params.value || 0).toFixed(2), // Ensures two decimal places
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 140,
      valueFormatter: (params) => parseFloat(params.value || 0).toFixed(0), // Ensures two decimal places
    },

    ,
    { field: "percentage", headerName: "Percentage (%)", width: 400 },
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

    {
      field: "result",
      headerName: "Result",
      width: 80,
      renderCell: (params) =>
        params.row.result ? (
          <Tooltip title="View Result">
            <IconButton
              color="warning"
              onClick={() => handleViewDocument(params.row, "result")}
            >
              <AssessmentIcon />
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
      field: "other_documents",
      headerName: "Other Documents",
      width: 130,
      renderCell: (params) =>
        params.row.other_documents ? (
          <Tooltip title="View Other Documents">
            <IconButton
              color="secondary"
              onClick={() => handleViewDocument(params.row, "other_documents")}
            >
              <FolderIcon />
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

  return (
    <Box sx={{ mt: 0, p: 1 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ color: "#333", fontWeight: "bold" }}
      >
        Projection Sheet
      </Typography>
      {studentId && (
        <div>
          <Paper
            sx={{
              marginTop: 0.5,
              width: "99%",
              borderRadius: "20px",
            }}
            elevation={6}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap", // Allow items to wrap on smaller screens
                alignItems: "center",
                background:
                  "linear-gradient(0deg, rgba(31,184,195,0) 0%, rgba(57,104,120,0.6112570028011204) 100%)",
                borderRadius: "20px",
                padding: "20px",
                gap: 2, // Adds spacing between items
              }}
            >
              {/* Avatar Section */}
              <Box
                sx={{
                  flex: { xs: "100%", sm: 0.5 },
                  minWidth: 100,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt="Profile pic"
                    src={studentData?.applications?.[0].profile_picture}
                    sx={{ width: 56, height: 56 }}
                  />
                </StyledBadge>
              </Box>

              {/* Name and Program Section */}
              <Box sx={{ flex: { xs: "100%", sm: 1.5 }, minWidth: 200 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", wordBreak: "break-word" }}
                >
                  {studentData?.applications?.[0].name
                    ? studentData.applications[0].name.toUpperCase()
                    : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "10px",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {studentData?.applications?.[0].program_interested_in?.toUpperCase()}{" "}
                  | STUDENT ID {studentData?.applications?.[0].id}
                </Typography>
              </Box>

              {/* Gender, DOB, Address */}
              <Box sx={{ flex: { xs: "100%", sm: 2 }, minWidth: 200 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  GENDER: {studentData?.applications?.[0].gender.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  DOB: {studentData?.applications?.[0].date_of_birth}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  ADDRESS:{" "}
                  {studentData?.applications?.[0].address.toUpperCase()}
                </Typography>
              </Box>

              {/* Place of Birth, Residency, Institute */}
              <Box sx={{ flex: { xs: "100%", sm: 2 }, minWidth: 200 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  PLACE OF BIRTH:{" "}
                  {studentData?.applications?.[0].village.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  PLACE OF RESIDENCY:{" "}
                  {studentData?.applications?.[0].country.toUpperCase()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  INSTITUTE:{" "}
                  {studentData?.applications?.[0].institution_interested_in.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </div>
      )}
      <Grid container spacing={2}>
        {/* Totals */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography
                variant="h5"
                // align="center"
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                Projection Sheet
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ color: "#333", fontWeight: "bold" }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontWeight: "bold" }} color="primary">
                {totals.totalAmount}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ color: "#333", fontWeight: "bold" }}>
                Received Upto Now
              </Typography>
              <Typography sx={{ fontWeight: "bold" }} color="success.main">
                {totals.totalPaid}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ color: "#333", fontWeight: "bold" }}>
                Remaining Amount
              </Typography>
              <Typography sx={{ fontWeight: "bold" }} color="error.main">
                {totals.remainingBalance}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#f5f5f5",
          p: 0,
          mb: 1,
          borderRadius: "10px",
          boxShadow: 2,
        }}
      >
        {/* <Typography variant="body1" sx={{ fontSize: "12px" }}>
          Education Fee Considered: {educationFeeConsidered.toLocaleString()}{" "}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "12px" }}>
          Education Fee (Based on {educationFeePercentage}%):{" "}
          {calculatedEducationFee.toLocaleString()}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "12px" }}>
          Other Cost Considered: {otherCostConsidered.toLocaleString()}{" "}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "12px" }}>
          Other Cost (Based on {otherCostPercentage}%):{" "}
          {calculatedOtherCost.toLocaleString()}
        </Typography> */}
      </Box>

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
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact"
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{
              boxShadow: 5,
              borderRadius: "10px",
              "& .MuiDataGrid-columnHeaders": {
                background:
                  "linear-gradient(90deg, rgba(57,104,120,0.6) 0%, rgba(31,184,195,1) 100%)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "uppercase",
              },
              "& .MuiDataGrid-row": {
                backgroundColor: "#f5fafd",
                "&:nth-of-type(even)": { backgroundColor: "#e8f4f8" },
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#d9f0f5",
                transform: "scale(1.01)",
                transition: "all 0.2s ease-in-out",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #ddd",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#e3f2fd",
                color: "#333",
                fontWeight: "bold",
              },
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
