import React, { useEffect, useState } from "react";
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
  Link as MuiLink,
  Divider,
  useMediaQuery,
  colors,
} from "@mui/material";
import axios from "axios";
import { GridToolbar } from "@mui/x-data-grid";
import { styled, useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionIcon from "@mui/icons-material/Description"; // Challan
import AssessmentIcon from "@mui/icons-material/Assessment"; // Result
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Receipt
import FolderIcon from "@mui/icons-material/Folder";
import { useParams } from "react-router-dom"; // Other Documents
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import {
  MdAttachMoney,
  MdImportExport,
  MdPendingActions,
} from "react-icons/md";
import { RiFundsBoxFill, RiFundsBoxLine } from "react-icons/ri";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { Visibility, Edit } from "@mui/icons-material";
import { FaRegThumbsUp } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bold } from "lucide-react";
import { CiExport } from "react-icons/ci";

// custom toolbar for table
const CustomToolbar = ({ selectedRows, handleExport }) => {
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
          disabled={selectedRows.length === 0}
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

// status button
const getStatusStyle = (status) => {
  switch (status) {
    case "Paid":
      return {
        color: "#fff",
        backgroundColor: "#4CAF50",
        icon: <CheckCircleIcon style={{ color: "#fff" }} />,
      };
    case "Pending":
      return {
        color: "#fff",
        backgroundColor: "#2196F3",
        icon: <InfoIcon style={{ color: "#fff" }} />,
      };
    case "Due":
      return {
        color: "#fff",
        backgroundColor: "#FF9800",
        icon: <WarningIcon style={{ color: "#fff" }} />,
      };
    case "Overdue":
      return {
        color: "#fff",
        backgroundColor: "#F44336",
        icon: <ErrorIcon style={{ color: "#fff" }} />,
      };
    default:
      return {
        color: "#fff",
        backgroundColor: "#9E9E9E",
        icon: <FaRegThumbsUp style={{ color: "#fff" }} />,
      };
  }
};

const StudentallProjections = () => {
  const { studentId } = useParams();
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
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleView = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  // Function to fetch projections and update table data
  const fetchStudentProjections = async () => {
    try {
      const token = localStorage.getItem("token");
      // const storedStudentId = localStorage.getItem("donorId");
      if (!token) {
        console.error("Token not available or missing studentId.");
        return;
      }
      // setStudentId(storedStudentId);

      const response = await fetch(
        `${BASE_URL}/api/students/${studentId}/projections/`,
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
      console.log(data);

      // Sort projections by semester_number in ascending order
      const sortedProjections = (data.projections || []).sort((a, b) => {
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
      setTotals({
        totalAmount: totalAmount.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
      setProjections(updatedProjections);
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
          !["challan", "receipt", "result", "other_documents"].includes(key)
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

  const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: "10px",
    margin: "2px 4px",
    textTransform: "capitalize",
    borderRadius: "16px",
    width: "75px", // fixed width
    height: "26px", // fixed height
    padding: "2px 6px", // ensure internal spacing
    justifyContent: "center", // align icon + text nicely
  }));

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
    // semster
    {
      field: "semester_number",
      headerName: "Semester",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "total_amount",
      headerName: "Total Amount Contribution",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },

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
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actual_amount_of_challan",
      headerName: "Actual Amount Of Challan",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "challanInfo",
      headerName: "Challan",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">
            {params.row.challan_date || (
              <span className="text-red-600 text-[12px]">no date</span>
            )}
          </Typography>
          {params.row.challan ? (
            <Tooltip title="View Challan">
              <IconButton
                color="info"
                onClick={() => handleViewDocument(params.row, "challan")}
                size="small"
              >
                <DescriptionIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Not Uploaded">
              <ErrorOutlineIcon fontSize="small" color="error" />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "challan_due_date",
      headerName: "Challan Due Date",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography sx={{ fontSize: "12px" }} variant="body2">
          {params?.row?.challan_due_date || (
            <span className="text-red-600 text-[12px]">no date</span>
          )}
        </Typography>
      ),
    },
    {
      field: "challan_payment_date",
      headerName: "Payment Date",
      flex: 1,
      minWidth: 106,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography sx={{ fontSize: "12px" }} variant="body2">
          {params?.row?.challan_payment_date || (
            <span className="text-red-600 text-[12px]">no date</span>
          )}
        </Typography>
      ),
    },
    {
      field: "receipt",
      headerName: "Tranfer Receipt ",
      flex: 1,
      minWidth: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row.receipt ? (
          <Box sx={{ display: "flex" }}>
            <Box>
              <Tooltip title="View Receipt">
                <IconButton
                  color="success"
                  onClick={() => handleViewDocument(params.row, "receipt")}
                >
                  <ReceiptLongIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              onClick={() => handleEdit(params.row)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#0376ab",
                backgroundColor: "#aaa",
                padding: "2px 4px ",
                width: "90px",
                borderRadius: "6px",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Edit sx={{ mr: 0.5, fontSize: "16px" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
                Re-Upload
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box>
              <Tooltip title="Not Uploaded">
                <Typography variant="body2" color="error">
                  <ErrorOutlineIcon sx={{ fontSize: "24px" }} />
                </Typography>
              </Tooltip>
            </Box>
            <Box
              onClick={() => handleEdit(params.row)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#0376ab",
                backgroundColor: "#aaa",
                padding: "2px 4px ",
                width: "80px",
                borderRadius: "6px",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Edit sx={{ mr: 0.5, fontSize: "16px" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
                Upload
              </Typography>
            </Box>
          </Box>
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

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 98,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let buttonColor = "";
        let buttonIcon = null;

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
            {feeStatus}
          </StyledButton>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Box
            onClick={() => handleView(params.row)}
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

  // for percentage export
  const formatPercentage = (raw) => {
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
  };

  // for export challan
  const formatChallan = (row) => {
    const date = row.challan_date ? row.challan_date : "no date";
    const fileStatus = row.challan ? "uploaded" : "no-file";
    return `${date} | ${fileStatus}`;
  };

  // for export challan due date
  const formatChallanDue = (row) => {
    const date = row.challan_due_date ? row.challan_due_date : "no date";
    return `${date} `;
  };

  // for export challan due date
  const formatPaymentDate = (row) => {
    const date = row.challan_payment_date
      ? row.challan_payment_date
      : "no date";
    return `${date} `;
  };

  // for export tranfer recipt
  const formatTranferRecipt = (row) => {
    const fileStatus = row.receipt ? "uploaded" : "no-file";
    return `${fileStatus}`;
  };

  // for export tranfer recipt
  const formatPaymentRecipt = (row) => {
    const fileStatus = row.payment_receipt ? "uploaded" : "no-file";
    return `${fileStatus}`;
  };

  // for export status
  const formatStatus = (row) => {
    const status = row.status;
    switch (status) {
      case "Paid":
        return "Paid"; // ✅ or ✔
      case "Pending":
        return "Pending"; // ℹ or 📘
      case "Due":
        return "Due"; // ⚠ or 🟠
      case "Overdue":
        return "Overdue"; // ❌ or 🔴
      default:
        return "OK"; // Default
    }
  };

  // export pdf
  const handleExport = () => {
    const doc = new jsPDF();
    console.log(studentData);

    // Adjust these dimensions as needed
    const imageWidth = 40;
    const imageHeight = 27;

    const rowsToExport = rows.map((row) => {
      return [
        row?.semester_number || "null",
        parseFloat(
          parseFloat(row?.total_amount || 0).toFixed(0)
        ).toLocaleString(),
        formatPercentage(row.percentage),
        row?.Projection_ending_date || "no date",
        parseFloat(
          parseFloat(row.actual_amount_of_challan || 0).toFixed(0)
        ).toLocaleString(),
        formatChallan(row),
        formatChallanDue(row),
        formatPaymentDate(row),
        formatTranferRecipt(row),
        formatPaymentRecipt(row),
        formatStatus(row),
      ];
    });

    // Declare tableStartY outside so it can be used later
    let tableStartY = 70; // default fallback

    autoTable(doc, {
      head: [
        [
          "Semester/Month",
          "Total Amount Contribution",
          "Percentage(%)",
          "Estimated Date Of Payment",
          "Actual Amount Of Challan",
          "Challan",
          "Challan Due Date",
          "Payment Date",
          "Transfer Recipt",
          "Payment Recipt",
          "Status",
        ],
      ],
      body: rowsToExport,
      styles: {
        fontSize: 8,
        overflow: "linebreak", // wrap long header text into multiple lines
        halign: "center", // also center body text if needed
        valign: "middle",
      },
      headStyles: {
        fillColor: [135, 206, 242], // background color
        fontSize: 7,
        halign: "center", // center horizontally
        valign: "middle", // center vertically
        cellPadding: 2, // optional: more space inside header cells
        lineWidth: 0.1, // optional: thin header borders
        textColor: 20, // optional: dark gray text
        textColor: 255, // white text for contrast (optional)
        fillColor: [20, 133, 129], // updated from hex #148581
      },
      columnStyles: {
        0: { cellWidth: 15, cellPadding: 4 }, // semester
        1: { cellWidth: 20 }, // Total Amount Contribution
        2: { cellWidth: 17 }, // Percentage(%)
        3: { cellWidth: 22 }, // Estimated Date Of Payment
        4: { cellWidth: 22 }, // actual amount
        5: { cellWidth: 16 }, // Challan
        6: { cellWidth: 18 }, // Challan Due Date
        7: { cellWidth: 18 }, // Payment Date
        8: { cellWidth: 16 }, // Transfer Receipt
        9: { cellWidth: 16 }, // Payment Receipt
        10: { cellWidth: 14 }, // Status
      },
      theme: "grid",
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.raw) {
          const imgData = data.cell.raw;
          if (imgData && typeof imgData === "string") {
            doc.addImage(
              imgData,
              "JPEG",
              data.cell.x + 1,
              data.cell.y + 1,
              imageWidth,
              imageHeight
            );
          } else if (imgData instanceof Blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              doc.addImage(
                base64data,
                "JPEG",
                data.cell.x + 1,
                data.cell.y + 1,
                imageWidth,
                imageHeight
              );
            };
            reader.readAsDataURL(imgData);
          }
        }
      },
      theme: "grid",
      didDrawPage: (data) => {
        // Header
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.setFontSize(14);
        doc.setTextColor(20, 133, 129);
        const studentName =
          studentData?.applications?.[0]?.name?.toUpperCase() || "STUDENT";

        doc.text(
          `${studentName} - Projection Sheet`,
          data.settings.margin.left,
          22
        );

        const student = studentData?.applications?.[0];
        const marginLeft = 14;
        const startY = 30;
        const lineSpacing = 6;
        let currentY = startY;

        // Profile picture
        if (student?.profile_picture) {
          doc.addImage(
            student.profile_picture,
            "JPEG",
            marginLeft,
            currentY,
            30,
            30
          );
        }

        const textX = marginLeft + 35;

        if (student?.name) {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const nameText = student.name.toUpperCase();
          const status = student.status ? `(${student.status})` : "";
          const statusColor =
            student.status?.toLowerCase() === "accepted"
              ? [68, 183, 0]
              : [255, 0, 0];
          doc.text(nameText, textX, currentY + 6);
          doc.setTextColor(...statusColor);
          doc.setFontSize(8);
          doc.text(
            status,
            textX + doc.getTextWidth(nameText) + 7,
            currentY + 5
          );
        }

        doc.setFontSize(9);
        doc.setTextColor(80);
        currentY += lineSpacing + 6;
        doc.text(
          `${student?.mobile_no || "N/A"} | ${student?.email || "N/A"} | ${
            student?.city || "N/A"
          }`,
          textX,
          currentY
        );

        currentY += lineSpacing;
        doc.text(
          student?.institution_interested_in || "No institution provided",
          textX,
          currentY
        );

        currentY += lineSpacing;
        doc.text(
          (student?.program_interested_in || "No program").toUpperCase(),
          textX,
          currentY
        );

        // ✅ Dynamically set startY for table here
        tableStartY = currentY + 10;

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        doc.setFontSize(10);
        doc.text(
          `Page ${pageCount}`,
          data.settings.margin.left,
          pageHeight - 10
        );
      },

      // ❌ REMOVE margin.top and replace with dynamic startY
      startY: tableStartY, // ✅ This ensures table starts after student info block
    });

    // Add Sponsorship Summary
    const finalY = doc.lastAutoTable.finalY + 20; // Increased space below table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80); // subtle gray text

    doc.text(
      `Total Amount Sponsored (PKR):  ${parseFloat(
        totals.totalAmount
      ).toLocaleString()}`,
      14,
      finalY
    );
    doc.text(
      `Total Donated So Far (PKR):  ${parseFloat(
        totals.totalPaid
      ).toLocaleString()}`,
      14,
      finalY + 8
    );
    doc.text(
      `Remaining Sponsorship (PKR):  ${parseFloat(
        totals.remainingBalance
      ).toLocaleString()}`,
      14,
      finalY + 16
    );

    doc.save("projectionsheet.pdf");
    setSelectAll(false);
  };

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
    <Box sx={{ mt: 0, p: 1 }}>
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
                src={studentData?.profile_picture}
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
                {studentData?.name ? studentData.name.toUpperCase() : ""}{" "}
                {studentData?.status && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.6rem",
                      color:
                        studentData.status.toLowerCase() === "accepted"
                          ? "#44b700"
                          : "red",
                    }}
                  >
                    ({studentData.status})
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
                {studentData?.mobile_no || "N/A"} |{" "}
                {studentData?.email || "N/A"} | {studentData?.city || "N/A"}
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
                {studentData?.institution_interested_in}
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
                {studentData?.program_interested_in?.toUpperCase()}{" "}
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
      <div className=" border-gray-300 border-b-[1px] mt-4 mb-5" />

      {/* main table */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
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
            rows={rows}
            columns={columns}
            density="compact"
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            components={{
              Toolbar: () => (
                <CustomToolbar
                  selectedRows={rows}
                  handleExport={handleExport}
                />
              ),
            }}
            rowHeight={null} // Let row height be dynamic
            getRowHeight={() => "auto"}
            sx={{
              height: "386px",
              minWidth: "300px",
              boxShadow: 5,
              borderRadius: "10px",
              overflow: "hidden", // Hide internal scrollbars
            }}
          />
        )}

        {/* modals */}

        {/* edit modal */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="md"
          PaperProps={{
            sx: {
              minWidth: "500px",
              minHeight: "400px",
              borderRadius: 3,
              backgroundColor: "#f9fafb",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              color: "#fff",
              backgroundColor: "#14475a",
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          >
            Upload Transfer Receipt
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
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

            <Box>
              <InputLabel shrink> Transfer Receipt</InputLabel>
              {/* {editRow?.receipt ? (
                <Button
                  size="small"
                  variant="contained"
                  href={editRow?.receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Receipt
                </Button>
              ) : ( */}
              <input
                type="file"
                name="receipt"
                onChange={(e) => handleFileChange(e, "receipt")}
                style={{ margin: "5px 0" }}
              />
              {/* )} */}
            </Box>

            <TextField
              margin="dense"
              label="Challan Payment Date"
              name="challan_payment_date"
              type="date"
              value={editRow?.challan_payment_date || ""}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* document view */}
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

        {/* view modal */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: "#f9fafb",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              color: "#fff",
              backgroundColor: "#14475a",
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          >
            📘 Semester {selectedRow?.semester_number} – Contribution Details
          </DialogTitle>

          {/* <span className="text-sm ml-6 mt-2 text-red-600">
            Note: The underlines feilds are not shown in table.
          </span> */}
          <DialogContent
            dividers
            sx={{ backgroundColor: "#ffffff", paddingX: 6 }}
          >
            {/* Fee Details Section */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ color: "#0284c7", fontWeight: 700 }}
              >
                Financial Contributions
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid container spacing={2} sx={{ paddingLeft: "30px" }}>
              <Grid item xs={6}>
                <Typography>
                  <strong>Education Fee: </strong>
                  {parseFloat(
                    parseFloat(
                      selectedRow?.education_fee_contribution || 0
                    ).toFixed(0)
                  ).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Other Cost: </strong>
                  {parseFloat(
                    parseFloat(
                      selectedRow?.other_cost_contribution || 0
                    ).toFixed(0)
                  ).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Admission Fee: </strong>{" "}
                  {parseFloat(
                    parseFloat(
                      selectedRow?.admission_fee_contribution || 0
                    ).toFixed(0)
                  ).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Total Amount: </strong>{" "}
                  {parseFloat(
                    parseFloat(selectedRow?.total_amount || 0).toFixed(0)
                  ).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    borderBottom: "1px solid red",
                  }}
                >
                  <strong>Percentage: </strong>{" "}
                  <span className="text-[#0a5a39] font-semibold">
                    {selectedRow?.percentage}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            {/* Dates Section */}
            <Grid item xs={12} mt={2}>
              <Typography
                variant="h6"
                sx={{ color: "#0284c7", fontWeight: 700 }}
              >
                Timeline
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid container spacing={2} sx={{ paddingLeft: "30px" }}>
              <Grid item xs={6}>
                <Typography>
                  <strong>Estimated Payment Date: </strong>{" "}
                  {selectedRow?.Projection_ending_date || (
                    <span className="font-semibold text-red-600">no data</span>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Challan Date: </strong>{" "}
                  {selectedRow?.challan_date || (
                    <span className="font-semibold text-red-600">no data</span>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Challan Due Date: </strong>{" "}
                  {selectedRow?.challan_due_date || (
                    <span className="font-semibold text-red-600">no data</span>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Payment Date: </strong>{" "}
                  {selectedRow?.challan_payment_date || (
                    <span className="font-semibold text-red-600">no data</span>
                  )}
                </Typography>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Typography>
                  <strong>Status:</strong>{" "}
                  <Button
                    variant="contained"
                    startIcon={getStatusStyle(selectedRow?.status).icon}
                    style={{
                      backgroundColor: getStatusStyle(selectedRow?.status)
                        .backgroundColor,
                      color: getStatusStyle(selectedRow?.status).color,
                      textTransform: "none",
                    }}
                    size="small"
                  >
                    {selectedRow?.status}
                  </Button>
                </Typography>
              </Grid>
            </Grid>
            {/* Documents Section */}
            <Grid item xs={12} mt={2}>
              <Typography
                variant="h6"
                sx={{ color: "#0284c7", fontWeight: 700 }}
              >
                Uploaded Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid container spacing={2} sx={{ paddingLeft: "30px" }}>
              {[
                { label: "Challan", key: "challan" },
                { label: "Receipt", key: "receipt" },
                { label: "Result", key: "result" },
                { label: "Other Documents", key: "other_documents" },
              ].map((doc, i) => (
                <Grid item xs={6} key={i}>
                  <Typography
                    sx={{
                      borderBottom:
                        doc.label === "Result" ||
                        doc.label === "Other Documents"
                          ? "1px solid red"
                          : "none",
                      paddingBottom:
                        doc.label === "Result" ||
                        doc.label === "Other Documents"
                          ? "4px"
                          : 0,
                      display: "inline-block",
                    }}
                  >
                    <strong>{doc.label}:</strong>{" "}
                    {selectedRow?.[doc.key] ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        component={MuiLink}
                        href={selectedRow[doc.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textTransform: "none",
                          ml: 1,
                        }}
                      >
                        View Document
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<AiOutlineIssuesClose />}
                        disabled
                        sx={{
                          textTransform: "none",
                          ml: 1,
                        }}
                      >
                        Not Uploaded
                      </Button>
                    )}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#f1f1f1" }}>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="error"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default StudentallProjections;
