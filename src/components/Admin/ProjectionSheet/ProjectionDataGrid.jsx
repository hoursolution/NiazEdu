import React, { useState, useEffect } from "react";
import axios from "axios";
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
  DialogContentText,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Tooltip,
  IconButton,
  Grid,
  Card,
  CardContent,
  FormControl,
  Select,
  Collapse,
  Slide,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Eye icon for "View"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionIcon from "@mui/icons-material/Description"; // Challan
import AssessmentIcon from "@mui/icons-material/Assessment"; // Result
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Receipt
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add"; // Other Documents
import RemoveIcon from "@mui/icons-material/Remove";
import { Snackbar, Alert } from "@mui/material";
import AdditionalSupportForm from "./AdditionalSupportForm";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { RiFundsBoxLine } from "react-icons/ri";
import { MdDelete, MdPendingActions } from "react-icons/md";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CiEdit, CiExport } from "react-icons/ci";
import { AiFillDelete } from "react-icons/ai";
import { ThumbUp } from "@mui/icons-material";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IoMdCloseCircle, IoMdEye } from "react-icons/io";

// Custom GridToolbar with the "Projection" button
const CustomToolbar = ({
  setShowForm,
  showForm,
  setShowSupportForm,
  showSupportForm,
  selectedRows,
  handleDelete,
  handleExport,
  rows,
}) => {
  return (
    <GridToolbarContainer>
      <Button
        variant="text"
        onClick={() => setShowForm(!showForm)}
        sx={{ marginRight: 2, color: "Highlight" }}
        startIcon={showForm ? <RemoveIcon /> : <AddIcon />}
      >
        {showForm ? "Hide Form" : "Projection"}
      </Button>

      {/* Toggle Additional Support Form */}
      <Button
        variant="text"
        onClick={() => setShowSupportForm(!showSupportForm)}
        sx={{ marginRight: 2, color: "seagreen" }}
        startIcon={showSupportForm ? <RemoveIcon /> : <AddIcon />}
      >
        {showSupportForm ? "Hide Support" : "Additional Support"}
      </Button>

      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />

      <Tooltip title="Export Report">
        <Button
          sx={{
            fontSize: "14px",
            letterSpacing: 0.15,
            fontWeight: 500,
            textTransform: "none",
            color: rows.length === 0 ? "gray" : "blue",
            "&:hover": {
              color: rows.length === 0 ? "gray" : "darkBlue",
              backgroundColor: "transparent",
            },
          }}
          // disabled={selectedRows.length === 0}
          onClick={handleExport}
          startIcon={<CiExport />}
        >
          Export
        </Button>
      </Tooltip>
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
        disabled={selectedRows?.length === 0}
        onClick={handleDelete}
        startIcon={<MdDelete />}
      >
        Delete
      </Button>
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
const MAX_FILE_SIZE_MB = 5; // 5MB limit
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ProjectionDataGrid = () => {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [projections, setProjections] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [originalRow, setOriginalRow] = useState(null); // Store original row data
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalPaid: 0,
    remainingBalance: 0,
  });
  // State to track selected files before upload
  const [fileErrors, setFileErrors] = useState({});

  const navigate = useNavigate();

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    // student: id,
    application: id,
    semester_number: "",
    education_fee_contribution: "",
    other_cost_contribution: "",
    admission_fee_contribution: "",
    total_amount: "",
    transport_contribution: "",
    health_insurance_contribution: "",
    eid_al_adha_contribution: "",
    eid_al_fitr_contribution: "",
    birthday_contribution: "",
    uniform_contribution: "",
    books_supplies_contribution: "",
    Projection_ending_date: "",
    actual_amount_of_challan: "",
    challan_date: "",
    challan_due_date: "",
    challan_payment_date: "",
    comment: "",
    status: "NYD",
    challan: null,
    receipt: null,
    payment_receipt: null,
    result: null,
    other_documents: null,
  });
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showSupportForm, setShowSupportForm] = useState(false);

  const [filePreviews, setFilePreviews] = useState({
    challan: null,
    receipt: null,
    result: null,
    other_documents: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChanges = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });

    // Set file preview
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreviews((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleViewDocuments = (file, type) => {
    if (file) {
      setFileUrl(file);
      setDocumentType(type);
      setOpenModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append non-file fields
    for (const key in formData) {
      if (
        key !== "challan" &&
        key !== "receipt" &&
        key !== "result" &&
        key !== "payment_receipt" &&
        key !== "other_documents"
      ) {
        data.append(key, formData[key]);
      }
    }

    // Append file fields only if a file is selected
    if (formData.challan) data.append("challan", formData.challan);
    if (formData.receipt) data.append("receipt", formData.receipt);
    if (formData.payment_receipt)
      data.append("payment_receipt", formData.payment_receipt);
    if (formData.result) data.append("result", formData.result);
    if (formData.other_documents)
      data.append("other_documents", formData.other_documents);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/projection-sheets/create/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Show success message
      setSnackbarMessage("Projection Sheet created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset the form after submission
      setFormData({
        // student: id,
        application: id,
        semester_number: "",
        education_fee_contribution: "",
        other_cost_contribution: "",
        admission_fee_contribution: "",
        total_amount: "",
        transport_contribution: "",
        health_insurance_contribution: "",
        eid_al_adha_contribution: "",
        eid_al_fitr_contribution: "",
        birthday_contribution: "",
        uniform_contribution: "",
        books_supplies_contribution: "",
        Projection_ending_date: "",
        actual_amount_of_challan: "",
        challan_date: "",
        challan_due_date: "",
        challan_payment_date: "",
        comment: "",
        status: "NYD",
        challan: null,
        receipt: null,
        payment_receipt: null,
        result: null,
        other_documents: null,
      });
      // Reset the form and file previews
      // Hide the form and refresh data
      setShowForm(false);
      fetchStudentProjections();
    } catch (error) {
      console.error("Error creating Projection Sheet:", error);

      // Show error message
      setSnackbarMessage(
        error.response?.data?.message || "Failed to create Projection Sheet"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Function to fetch projections and update table data
  const fetchStudentProjections = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not available.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/students/${id}/projections/`,
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
      setProjections(updatedProjections);
      setTotals({
        totalAmount: totalAmount.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
      console.log(updatedProjections);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // useEffect to fetch data when the component mounts or ID changes
  useEffect(() => {
    fetchStudentProjections();
  }, [id]);

  const handleEdit = (row) => {
    setEditRow(row);
    setOriginalRow({ ...row }); // Store original values
    setIsEditModalOpen(true);
  };

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

  // delete
  const handleDelete = async () => {
    try {
      const deleteRequests = selectedRowIds.map((ids) =>
        axios.delete(`${BASE_URL}/api/projections/${ids}/delete/`)
      );

      await Promise.all(deleteRequests);

      // Optionally, refresh your data and clear selected IDs
      setSnackbarMessage("All selected projections deleted.");
      setSnackbarOpen(true); // Open Snackbar upon successful submission
      fetchStudentProjections();
    } catch (error) {
      console.error("Error deleting projections:", error);
      setSnackbarMessage("Error deleting students:");
      setSnackbarOpen(true); // Open Snackbar upon successful submission
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    let error = null;

    if (file) {
      // Validate file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        error = "Invalid file type (only PDF, JPG, PNG allowed)";
      }
      // Validate file size
      else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        error = `File too large (max ${MAX_FILE_SIZE_MB}MB)`;
      }

      if (error) {
        setFileErrors((prev) => ({ ...prev, [fieldName]: error }));
        setSelectedFiles((prev) => ({ ...prev, [fieldName]: null }));
      } else {
        setSelectedFiles((prev) => ({ ...prev, [fieldName]: file }));
        setFileErrors((prev) => ({ ...prev, [fieldName]: null }));
        // Preview file immediately (creates object URL)
        const fileUrl = URL.createObjectURL(file);
        handleInputChange({
          target: {
            name: fieldName,
            value: fileUrl,
          },
        });
      }
    } else {
      setSelectedFiles((prev) => ({ ...prev, [fieldName]: null }));
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
        url = row.payment_receipt; // Assuming `row.receipt_document_url` holds the URL
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
  const [deleteId, setDeleteId] = useState(null); // Track the ID of the row to delete
  const [confirmOpen, setConfirmOpen] = useState(false); // Control dialog visibility

  const handleDeleteClick = (projectionId) => {
    setDeleteId(projectionId); // Set the ID of the row to delete
    setConfirmOpen(true); // Open the confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await axios.delete(`${BASE_URL}/api/projections/${deleteId}/delete/`);
        // console.log("Projection deleted successfully");
        fetchStudentProjections();
        // Remove the deleted row from the state
        setRows(rows.filter((row) => row.id !== deleteId));
      } catch (error) {
        console.error("Error deleting projection:", error);
      } finally {
        setConfirmOpen(false); // Close the dialog
        setDeleteId(null); // Reset the delete ID
      }
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false); // Close the dialog
    setDeleteId(null); // Reset the delete ID
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

    {
      field: "semester_number",
      headerName: "Month",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "education_fee_contribution",
      headerName: "Tuition Fee",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "other_cost_contribution",
      headerName: "Other Cost ",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "admission_fee_contribution",
      headerName: "Admission Charges",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "transport_contribution",
      headerName: "Transportation Fee",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "health_insurance_contribution",
      headerName: "Health Insurance",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "eid_al_adha_contribution",
      headerName: "Eid al-Adha Gift",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "eid_al_fitr_contribution",
      headerName: "Eid al-Fitr Gift",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "birthday_contribution",
      headerName: "Birthday Gift",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "uniform_contribution",
      headerName: "Uniform Cost",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "books_supplies_contribution",
      headerName: "Books & Supplies",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) =>
        parseFloat(parseFloat(params.value || 0).toFixed(0)).toLocaleString(),
    },

    // {
    //   field: "percentage",
    //   headerName: "Percentage(%)",
    //   flex: 1,
    //   minWidth: 105,
    //   headerAlign: "center",
    //   align: "center",
    //   valueGetter: (params) => {
    //     const raw = params.row.percentage;
    //     if (!raw) return "N/A";

    //     const cleaned = raw.replace(/Sponsor \d+:\s*/g, "").split(",");
    //     const rounded = cleaned.map((p) => Math.round(parseFloat(p)));

    //     if (rounded.length === 1 || (rounded[1] && rounded[1] > 0)) {
    //       return rounded
    //         .filter((v) => v > 0)
    //         .map((v) => `${v}%`)
    //         .join(", ");
    //     } else {
    //       return `${rounded[0]}%`;
    //     }
    //   },
    // },
    {
      field: "comment",
      headerName: "Notes / Remarks",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Projection_ending_date",
      headerName: "Estimated Date Of Payment",
      flex: 1,
      minWidth: 110,
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
      minWidth: 80,
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
            {/* <Box
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
            </Box> */}
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
            {/* <Box
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
            </Box> */}
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
      field: "result",
      headerName: "Result",
      flex: 1,
      minWidth: 70,
      headerAlign: "center",
      align: "center",
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
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
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
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<CiEdit size="18px" />}
              onClick={() => handleEdit(params.row)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "10px",
                fontWeight: 700,
                color: "#0376ab",
                backgroundColor: "#aaa",
                padding: "1px 2px ",
                width: "90px",
                borderRadius: "6px",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "#0376ab",
                  color: "white",
                },
              }}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<AiFillDelete size="18px" />}
              onClick={() => handleDeleteClick(params.row.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "10px",
                fontWeight: 700,
                color: "#941d15",
                backgroundColor: "#aaa",
                padding: "1px 2px ",
                width: "90px",
                borderRadius: "6px",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "#941d15",
                  color: "white",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </>
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
    console.log(rows);

    // Adjust these dimensions as needed
    const imageWidth = 40;
    const imageHeight = 27;

    const rowsToExport = rows.map((row) => {
      return [
        row?.semester_number || "null",
        parseFloat(
          parseFloat(row?.total_amount || 0).toFixed(0)
        ).toLocaleString(),
        formatPercentage(row?.percentage),
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

        const student = studentData;
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
          // const status = student.status ? `(${student.status})` : "";
          // const statusColor =
          // student.status?.toLowerCase() === "accepted"
          // ? [68, 183, 0]
          // : [255, 0, 0];
          doc.text(nameText, textX, currentY + 6);
          // doc.setTextColor(...statusColor);
          doc.setFontSize(8);
          // doc.text(
          //   // status,
          //   textX + doc.getTextWidth(nameText) + 7,
          //   currentY + 5
          // );
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box sx={{ width: "100%" }}>
      {id && (
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
              <span className="font-bold text-xs ">
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

              <span className="font-bold text-xs ">
                Total Sponsored So Far (PKR)
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

              <span className="font-bold text-xs ">
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
      ></Box>
      <Collapse in={showForm}>
        <Dialog
          open={showForm}
          onClose={() => setShowForm(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              padding: { xs: 2, sm: 3 },
              marginBottom: 2,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" align="center" gutterBottom>
                Add Projection
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Semester Number */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Month"
                      name="semester_number"
                      type="number"
                      value={formData.semester_number}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </Grid>

                  {/* Monthly Tuition Fee */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Monthly Tuition Fee"
                      name="education_fee_contribution"
                      type="number"
                      value={formData.education_fee_contribution}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </Grid>

                  {/* Other Cost Contribution */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Other Cost"
                      name="other_cost_contribution"
                      type="number"
                      value={formData.other_cost_contribution}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  {/* Total Amount */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Total Amount"
                      name="total_amount"
                      type="number"
                      value={formData.total_amount}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </Grid>

                  {/* Additional Contributions */}
                  {[
                    {
                      label: "Transportation Fee",
                      name: "transport_contribution",
                    },
                    {
                      label: "Health Insurance",
                      name: "health_insurance_contribution",
                    },
                    { label: "Eid al-Adha", name: "eid_al_adha_contribution" },
                    { label: "Eid al-Fitr", name: "eid_al_fitr_contribution" },
                    { label: "Birthday Gift", name: "birthday_contribution" },
                    { label: "Uniform Cost", name: "uniform_contribution" },
                    {
                      label: "Books & Supplies",
                      name: "books_supplies_contribution",
                    },
                  ].map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.name}>
                      <TextField
                        variant="outlined"
                        size="small"
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        fullWidth
                        type="number"
                      />
                    </Grid>
                  ))}

                  {/* Estimated Date of Payment */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Estimated Date of Payment"
                      name="Projection_ending_date"
                      type="date"
                      value={formData.Projection_ending_date}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Actual Amount of Challan */}
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      fullWidth
                      label="Actual Amount of Challan"
                      name="actual_amount_of_challan"
                      type="number"
                      value={formData.actual_amount_of_challan}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                      >
                        <MenuItem value="NYD">NYD</MenuItem>
                        <MenuItem value="Due">Due</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Overdue">Overdue</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* File Upload Fields */}
                  {[
                    {
                      name: "challan",
                      label: "Challan",
                      icon: <DescriptionIcon />,
                    },
                    {
                      name: "receipt",
                      label: "Receipt",
                      icon: <ReceiptLongIcon />,
                    },
                    {
                      name: "result",
                      label: "Result",
                      icon: <AssessmentIcon />,
                    },
                    {
                      name: "other_documents",
                      label: "Other Documents",
                      icon: <FolderIcon />,
                    },
                  ].map((field) => (
                    <Grid item xs={12} sm={6} md={6} key={field.name}>
                      <Typography variant="subtitle2" gutterBottom>
                        {field.label}
                      </Typography>
                      <input
                        type="file"
                        name={field.name}
                        onChange={handleFileChanges}
                        style={{ marginBottom: "8px", width: "100%" }}
                      />
                      {filePreviews[field.name] && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() =>
                            handleViewDocuments(
                              filePreviews[field.name],
                              field.label
                            )
                          }
                        >
                          View {field.label}
                        </Button>
                      )}
                    </Grid>
                  ))}

                  {/* Comment Field */}
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Comment"
                      name="comment"
                      value={formData.comment || ""}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Box>
        </Dialog>
      </Collapse>

      {/* Additional Support Section */}
      {/* Collapsible Form */}
      <Collapse in={showSupportForm}>
        <Dialog
          open={showSupportForm}
          onClose={() => setShowSupportForm(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <AdditionalSupportForm studentId={id} />
        </Dialog>
      </Collapse>

      <Box sx={{ width: "100%" }}>
        {/* main table */}
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
            loading={loading}
            checkboxSelection // ✅ Show checkboxes
            onRowSelectionModelChange={handleRowSelection} // ✅ Track selection
            components={{
              Toolbar: () => (
                <CustomToolbar
                  setShowForm={setShowForm}
                  showForm={showForm}
                  setShowSupportForm={setShowSupportForm}
                  showSupportForm={showSupportForm}
                  selectedRows={selectedRowIds}
                  selectedRowIds={selectedRowIds}
                  handleDelete={handleDelete}
                  handleExport={handleExport}
                  rows
                />
              ),
            }}
            rowHeight={null} // Let row height be dynamic
            getRowHeight={() => "auto"}
            sx={{
              height: "390px",
              minWidth: "300px",
              boxShadow: 5,
              borderRadius: "10px",
              overflow: "hidden", // Hide internal scrollbars
            }}
          />
        )}

        {/* edit modal */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 2,
              fontSize: "1.2rem",
            }}
          >
            Edit Projection
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            <Grid container spacing={3} sx={{ mb: 2, mt: 2 }}>
              {/* Row 1 */}
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Month"
                  name="semester_number"
                  value={editRow?.semester_number || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Sponsor"
                  name="sponsor_name"
                  value={editRow?.sponsor_name || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Total Amount"
                  name="total_amount"
                  type="number"
                  value={editRow?.total_amount || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Admission Fee"
                  name="admission_fee_contribution"
                  value={editRow?.admission_fee_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Monthly Tuition Fee"
                  name="education_fee_contribution"
                  value={editRow?.education_fee_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Other Costs"
                  name="other_cost_contribution"
                  value={editRow?.other_cost_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Transportation Fee"
                  name="transport_contribution"
                  value={editRow?.transport_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Health Insurance"
                  name="health_insurance_contribution"
                  value={editRow?.health_insurance_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Row 3 */}
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Eid al-Adha"
                  name="eid_al_adha_contribution"
                  value={editRow?.eid_al_adha_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Eid al-Fitr"
                  name="eid_al_fitr_contribution"
                  value={editRow?.eid_al_fitr_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Birthday Gift"
                  name="birthday_contribution"
                  value={editRow?.birthday_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Uniform Cost"
                  name="uniform_contribution"
                  value={editRow?.uniform_contribution || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Dates Section */}
              {/* <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Dates
                </Typography>
              </Grid> */}

              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Estimated Date"
                  name="Projection_ending_date"
                  type="date"
                  value={editRow?.Projection_ending_date || ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Actual Amount"
                  name="actual_amount_of_challan"
                  type="number"
                  value={editRow?.actual_amount_of_challan || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Challan Date"
                  name="challan_date"
                  type="date"
                  value={editRow?.challan_date || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <TextField
                  size="small"
                  label="Due Date"
                  name="challan_due_date"
                  type="date"
                  value={editRow?.challan_due_date || ""}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Documents Section */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Documents
                </Typography>
              </Grid>

              {/* Challan Dates */}
              <Grid container spacing={2}>
                {[
                  "challan",
                  "receipt",
                  "payment_receipt",
                  "result",
                  "other_documents",
                ].map((docType) => {
                  const fileType = selectedFiles[docType]?.type || "";
                  const fileSizeMB = selectedFiles[docType]
                    ? (selectedFiles[docType].size / (1024 * 1024)).toFixed(2)
                    : null;

                  return (
                    <Grid item xs={12} sm={6} key={docType}>
                      <Box
                        sx={{
                          border: "1px solid #eee",
                          borderRadius: 1,
                          p: 2,
                          position: "relative",
                        }}
                      >
                        {/* Document Type Label */}
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {docType.replace(/_/g, " ").toUpperCase()}
                        </Typography>

                        {/* Existing File Display */}
                        {editRow?.[docType] && !selectedFiles[docType] && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              // mb: 1,
                            }}
                          >
                            <Tooltip title="View document">
                              <IconButton
                                href={editRow[docType]}
                                target="_blank"
                                color="primary"
                                size="large"
                              >
                                {IoMdEye(
                                  editRow[docType].includes("pdf")
                                    ? "application/pdf"
                                    : "image/jpeg"
                                )}
                              </IconButton>
                            </Tooltip>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              Current File
                            </Typography>
                          </Box>
                        )}

                        {/* Selected File Display */}
                        {selectedFiles[docType] && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                              p: 1,
                              backgroundColor: "#f5f5f5",
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ color: "primary.main" }}>
                              <CheckCircleIcon
                                color="success"
                                fontSize="small"
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" noWrap>
                                {selectedFiles[docType].name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {fileSizeMB} MB •{" "}
                                {fileType.split("/")[1]?.toUpperCase()}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => clearFileSelection(docType)}
                            >
                              <IoMdCloseCircle size={20} color="red" />
                            </IconButton>
                          </Box>
                        )}

                        {/* File Error */}
                        {fileErrors[docType] && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: "error.main",
                              mt: 1,
                            }}
                          >
                            <ErrorOutlineIcon fontSize="small" />
                            <Typography variant="caption">
                              {fileErrors[docType]}
                            </Typography>
                          </Box>
                        )}

                        {/* File Upload */}
                        <label htmlFor={`upload-${docType}`}>
                          <Button
                            component="span"
                            variant="outlined"
                            color="primary"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                            sx={{ mt: 1 }}
                          >
                            {editRow?.[docType] ? "Replace" : "Upload"}
                            <input
                              id={`upload-${docType}`}
                              type="file"
                              name={docType}
                              onChange={(e) => handleFileChange(e, docType)}
                              accept=".pdf,.jpg,.jpeg,.png"
                              hidden
                            />
                          </Button>
                        </label>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              variant="outlined"
              color="error"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              color="primary"
              sx={{ minWidth: 100 }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* view modal */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>View {documentType} Document</DialogTitle>
          <DialogContent>
            {fileUrl ? (
              <img
                src={fileUrl}
                title="Document Viewer"
                width="100%"
                height="100%"
                frameBorder="0"
              ></img>
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

        {/* delate Inline Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle className="bg-slate-700 text-white">
            Delete Projection
          </DialogTitle>
          <DialogContent className="mt-4">
            <DialogContentText>
              Are you sure you want to delete this projection?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000} // Auto-close after 6 seconds
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position of the snackbar
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProjectionDataGrid;
