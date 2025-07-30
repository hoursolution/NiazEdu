import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css"; // Keep if you have custom CSS, otherwise can be removed
import {
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  styled,
  Typography, // Added Typography for status text
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"; // Not used, but kept for completeness
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info"; // Not used, but kept for completeness
import EditIcon from "@mui/icons-material/Edit"; // Not used, but kept for completeness
import { MdDelete, MdEdit } from "react-icons/md";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // For Add Verification button
import { motion } from "framer-motion"; // Import motion for animations
import CircularProgress from "@mui/material/CircularProgress";

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

// Custom GridToolbar with the "Projection" button
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
    borderLeft: `1px solid ${headerBg}`, // Subtle border between headers
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

const AllVarification = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${BASE_URL}/api/verifications/`)
      .then((response) => response.json())
      .then((data) => {
        // Group by student full name
        console.log(data);
        const grouped = {};
        data.forEach((item) => {
          const key = `${item.application.name} ${item.application.last_name}`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(item);
        });

        // Process each group
        const groupedWithSortKey = Object.values(grouped).map((group) => {
          // Sort internally by application ID
          group.sort((a, b) => a.application.id - b.application.id);
          return {
            sortKey: group[0].application.id, // use the first application ID as sort key
            items: group,
          };
        });

        // Sort groups based on first application ID
        groupedWithSortKey.sort((a, b) => a.sortKey - b.sortKey);

        // Flatten the sorted groups and apply suffixes
        const updatedData = [];
        groupedWithSortKey.forEach((group) => {
          group.items.forEach((item, index) => {
            const order = index + 1;
            const suffix = order === 1 ? "" : ` (${order})`;
            const displayName = `${item.application.name} ${item.application.last_name}${suffix}`;
            updatedData.push({
              ...item,
              displayNameWithOrder: displayName,
            });
          });
        });

        setApplications(updatedData);
        setFilteredApplications(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = applications;

    if (nameFilter) {
      filtered = filtered.filter((app) =>
        `${app.application.name} ${app.application.last_name}`
          .toLowerCase()
          .includes(nameFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [nameFilter, statusFilter, applications]);

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/api/verifications/delete/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setApplications((prev) => prev.filter((app) => app.id !== id));
        } else {
          console.error("Failed to delete application");
        }
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
      });
  };

  const handleEdit = (id) => {
    navigate(`/Admin/editVerification/${id}`);
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
      field: "applicationName",
      headerName: "Application Name",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.displayNameWithOrder || "",
    },
    {
      field: "verifier_name",
      headerName: "Verifier Name",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const name = params.row.verifier_name;
        const isSelected = !!name;
        return (
          <Typography
            sx={{
              color: isSelected ? textColor : "#EF4444",
              fontSize: "12px", // Add this to match cell font size
            }}
          >
            {isSelected ? name : "not selected"}
          </Typography>
        );
      },
    },
    {
      field: "verification_date",
      headerName: "Verification Date",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const date = params.row.verification_date;
        const isSelected = !!date;
        return (
          <Typography
            sx={{
              color: isSelected ? textColor : "#EF4444",
              fontSize: "12px", // Add this to match cell font size
            }}
          >
            {isSelected ? date : "not selected"}
          </Typography>
        );
      },
    },

    {
      field: "move_for_interview",
      headerName: "Status",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.row.move_for_interview;
        let buttonColor = "";
        let buttonIcon = null;
        let statusTextColor = textColor;
        let buttonText = ""; // Default text color

        switch (status) {
          case "yes":
            buttonColor = "#10B981"; // Green
            buttonIcon = (
              <CheckCircleIcon sx={{ color: "#fff", fontSize: "12px" }} />
            );
            statusTextColor = "#10B981"; // Green text
            buttonText = "Accepted";
            break;

          case "Pending":
            buttonColor = "#F59E0B"; // Amber
            buttonIcon = <ErrorIcon sx={{ color: "#fff", fontSize: "12px" }} />;
            statusTextColor = "#F59E0B"; // Amber text
            buttonText = "Pending";
            break;

          case "no":
            buttonColor = "#EF4444"; // Red
            buttonIcon = (
              <CancelIcon sx={{ color: "#fff", fontSize: "12px" }} />
            );
            statusTextColor = "#EF4444"; // Red text
            buttonText = "Rejected";
            break;

          default:
            buttonColor = "#9E9E9E"; // Grey
            buttonIcon = null;
            statusTextColor = "#9E9E9E"; // Grey text
            buttonText = "Pending";
        }

        return (
          <Button
            variant="contained"
            startIcon={buttonIcon}
            size="small"
            sx={{
              backgroundColor: buttonColor,
              color: "#fff",
              textTransform: "none",
              pointerEvents: "none", // Make it non-interactive
              fontSize: "10px", // Smaller font for status button
              padding: "4px 8px",
              fontWeight: "bold",
            }}
          >
            {buttonText}
          </Button>
        );
      },
    },

    {
      field: "edit",
      headerName: "Verify",
      minWidth: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<MdEdit size={14} />}
            sx={{
              backgroundColor: accentColor, // Use accent color
              color: "white",
              textTransform: "capitalize",
              fontSize: "10px", // Smaller font for button
              padding: "4px 8px",
              "&:hover": {
                backgroundColor: "#2563EB", // Darker blue on hover
              },
            }}
            onClick={() => handleEdit(params.row.id)}
          >
            Update
          </Button>
        </motion.div>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<MdDelete size={14} />}
            sx={{
              backgroundColor: "#EF4444", // Red for delete
              color: "white",
              textTransform: "capitalize",
              fontSize: "10px", // Smaller font for button
              padding: "4px 8px",
              "&:hover": {
                backgroundColor: "#DC2626", // Darker red on hover
              },
            }}
            onClick={() => {
              setDeleteId(params.row.id);
              setDeleteConfirmationOpen(true);
            }}
          >
            Delete
          </Button>
        </motion.div>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        paddingTop: "20px",
        backgroundColor: bgColor,
        minHeight: "calc(100vh - 50px)",
        padding: "20px",
      }}
    >
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
        {/* Name Filter */}
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "30%" },
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

        {/* Status Filter */}
        <FormControl sx={{ width: { xs: "100%", sm: "30%" } }} size="small">
          {/* <InputLabel sx={{ color: textColor }}>Status</InputLabel> */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            sx={{
              color: textColor,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: textColor },
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
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Accepted by verifier">
              Accepted by Verifier
            </MenuItem>
            <MenuItem value="Rejected by verifier">
              Rejected by Verifier
            </MenuItem>
          </Select>
        </FormControl>

        {/* Add Verification Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: accentColor,
              color: "white",
              textTransform: "capitalize",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "#1C3070",
              },
            }}
            onClick={() => navigate("/Admin/addVarification")}
            endIcon={<AddCircleOutlineIcon />}
          >
            Add Verification
          </Button>
        </motion.div>
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
            borderRadius: "10px",
            backgroundColor: cardBg,
            boxShadow: 3,
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            style={{ color: accentColor }}
          />{" "}
          <span style={{ fontSize: "14px", color: "#333" }}>
            Loading Verifications...
          </span>
        </Box>
      ) : (
        <StyledDataGrid
          rows={filteredApplications}
          columns={columns}
          density="compact"
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          components={{
            Toolbar: () => <CustomToolbar />,
          }}
          rowHeight={null}
          getRowHeight={() => "auto"}
          sx={{
            height: "405px",
            minWidth: "300px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDelete(deleteId);
          setDeleteConfirmationOpen(false);
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this Verification?"
      />
    </Box>
  );
};

export default AllVarification;
