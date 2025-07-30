import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import styles from "./AllApplication.module.css"; // Keep if you have custom CSS, otherwise can be removed
import {
  Box,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { MdDelete, MdEdit } from "react-icons/md";
import { motion } from "framer-motion"; // Import motion for animations
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

// Custom GridToolbar with the "Projection" button
const CustomToolbar = ({ handleExportPDF, selectedRows }) => {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: cardBg,
        borderBottom: `1px solid ${headerBg}`,
        padding: "8px",
        borderRadius: "8px 8px 0 0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <GridToolbarColumnsButton sx={{ color: textColor }} />
        <GridToolbarDensitySelector sx={{ color: textColor }} />
      </Box>

      <Button
        variant="contained"
        disabled={selectedRows.length === 0}
        sx={{
          backgroundColor: selectedRows.length === 0 ? "#ccc" : "#148581",
          color: "white",
          textTransform: "capitalize",
          fontSize: "12px",
          padding: "4px 10px",
          "&:hover": {
            backgroundColor: selectedRows.length === 0 ? "#ccc" : "#0e6c69",
          },
        }}
        onClick={handleExportPDF}
      >
        Export PDF
      </Button>
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

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all
  const [nameFilter, setNameFilter] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // Default to 10 rows per page
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  const fetchApplications = () => {
    setLoading(true); // Start loading

    fetch(`${BASE_URL}/all-applications/`)
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.id - b.id);
        const countsMap = new Map();
        const processedData = sortedData.map((app) => {
          const key = `${app.name}-${app.last_name}`.toLowerCase();
          const count = (countsMap.get(key) || 0) + 1;
          countsMap.set(key, count);
          return {
            ...app,
            studentCount: count,
          };
        });

        setApplications(processedData);
        setFilteredApplications(processedData);
        console.log(processedData);
      })
      .catch((error) => console.error("Error fetching applications:", error))
      .finally(() => setLoading(false)); // Stop loading after fetch
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    if (nameFilter) {
      const lowerNameFilter = nameFilter.toLowerCase();
      filtered = filtered.filter((app) => {
        const displayName =
          app.studentCount > 1
            ? `${app.name} ${app.last_name} (${app.studentCount})`
            : `${app.name} ${app.last_name}`;
        return displayName.toLowerCase().includes(lowerNameFilter);
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [nameFilter, statusFilter, applications]);

  const handleDeleteConfirmationOpen = (id) => {
    setDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/api/applications/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          // Re-fetch applications to update counts
          fetchApplications();
        } else {
          console.error("Failed to delete application");
        }
      })
      .catch((error) => console.error("Error deleting application:", error));
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
      field: "name",
      headerName: "NAME",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        const { row } = params;
        return row.studentCount > 1
          ? `${row.name} ${row.last_name} (${row.studentCount})`
          : `${row.name} ${row.last_name}`;
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.value;

        // Set text color based on status
        let textColorStatus = "#9E9E9E"; // default grey
        switch (status?.toLowerCase()) {
          case "pending":
            textColorStatus = "#F59E0B"; // Amber for pending
            break;
          case "accepted":
            textColorStatus = "#10B981"; // Green for accepted
            break;
          case "rejected":
            textColorStatus = "#EF4444"; // Red for rejected
            break;
        }

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: textColorStatus, fontWeight: 700 }}
            >
              {status || "N/A"}
            </Typography>
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
                onClick={() =>
                  navigate(`/Admin/editApplicationsStatus/${params.row.id}`)
                }
              >
                Update
              </Button>
            </motion.div>
          </Box>
        );
      },
    },
    {
      field: "edit",
      headerName: "Application",
      minWidth: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="small"
            variant="contained"
            sx={{
              backgroundColor: primaryColor, // Use primary color
              color: "#fff",
              fontWeight: "bold",
              textTransform: "capitalize",
              fontSize: "10px", // Smaller font for button
              padding: "4px 8px",
              "&:hover": {
                backgroundColor: "#1C3070", // Darker navy on hover
              },
            }}
            onClick={() =>
              navigate(`/Admin/updateApplication/${params.row.id}`)
            }
          >
            View / Edit
          </Button>
        </motion.div>
      ),
    },
    {
      field: "delete",
      headerName: "DELETE",
      minWidth: 150,
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
              handleDeleteConfirmationOpen(params.row.id);
            }}
          >
            Delete
          </Button>
        </motion.div>
      ),
    },
  ];

  // export pdf
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Define table head
    const tableHead = [
      [
        "S.No",
        "Name",
        "City",
        "DOB",
        "Address",
        "Current School",
        "Disability",
        "Status",
      ],
    ];

    // Prepare rows
    const selectedData = filteredApplications.filter((app) =>
      selectedRows.includes(app.id)
    );

    console.log(selectedData);
    const tableRows = selectedData.map((app, index) => {
      const name =
        app.studentCount > 1
          ? `${app.name} ${app.last_name} (${app.studentCount})`
          : `${app.name} ${app.last_name}`;

      return [
        index + 1,
        name,
        app.city,
        app.date_of_birth,
        app.address,
        app.current_school,
        app.disability_nature,
        app.status || "N/A",
      ];
    });

    // Generate the table
    autoTable(doc, {
      head: tableHead,
      body: tableRows,
      styles: {
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [20, 133, 129],
        textColor: 255,
        fontSize: 10,
      },
      startY: 20,
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        doc.setFontSize(10);
        doc.text(
          `Page ${pageCount}`,
          data.settings.margin.left,
          pageHeight - 10
        );
      },
    });

    doc.save("All_Applications.pdf");
  };

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
          flexDirection: { xs: "column", sm: "row" },
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
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {/* Add Application Button */}
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
            onClick={() => navigate("/Admin/addApplicationss")}
            endIcon={<AddCircleOutlineIcon />}
          >
            Add Application
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
            Loading Applications...
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
            Toolbar: () => (
              <CustomToolbar
                handleExportPDF={handleExportPDF}
                selectedRows={selectedRows}
              />
            ),
          }}
          rowHeight={null}
          getRowHeight={() => "auto"}
          sx={{
            height: "405px",
            minWidth: "300px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          }}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) =>
            setSelectedRows(newSelection)
          }
          rowSelectionModel={selectedRows}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={() => {
          handleDelete(deleteId);
          handleDeleteConfirmationClose();
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this application?"
      />
    </Box>
  );
};

export default AllApplications;
