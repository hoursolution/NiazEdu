import React, { useState, useEffect, useCallback } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton, // Kept for consistency if needed, but not used in CustomToolbar
} from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css"; // Keep if you have custom CSS, otherwise can be removed
import {
  Box,
  Button,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton, // Kept for consistency if needed, but not used in renderCell for delete
  styled,
  Typography,
  CircularProgress, // Added Typography for consistent text styling
} from "@mui/material";
import DonorCreation from "../Profiles/DonorCreation";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import EditSelectDonorForm from "./EditSelectDonor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"; // Not used, but kept for completeness
import { MdDelete, MdEdit } from "react-icons/md"; // For consistent icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // For Add Donor button
import { motion } from "framer-motion"; // Import motion for animations
import { SelectAllOutlined } from "@mui/icons-material";
import ViewSelectDonor from "./ViewSelectDonor";
import { IoMdEye } from "react-icons/io";

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

const AllSelectDonorList = () => {
  const [selectDonorList, setSelectDonorList] = useState([]);
  const [filteredDonorList, setFilteredDonorList] = useState([]);
  const [donors, setDonors] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [addDonorDialogOpen, setAddDonorDialogOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [selectedDonor, setSelectedDonor] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [donorResponse, selectDonorResponse, allApplicationsResponse] =
        await Promise.all([
          fetch(`${BASE_URL}/api/donor/`),
          fetch(`${BASE_URL}/api/select-donor/`),
          fetch(`${BASE_URL}/all-applications/`),
        ]);

      if (
        !donorResponse.ok ||
        !selectDonorResponse.ok ||
        !allApplicationsResponse.ok
      ) {
        throw new Error("Failed to fetch data");
      }

      const [donorData, selectDonorData, allApplications] = await Promise.all([
        donorResponse.json(),
        selectDonorResponse.json(),
        allApplicationsResponse.json(),
      ]);

      // Step 1: Build map from application ID → application object
      const applicationMap = new Map();
      allApplications.forEach((app) => {
        applicationMap.set(app.id, app);
      });

      // Step 2: Group selectDonorData by student full name
      const grouped = {};
      selectDonorData.forEach((item) => {
        const app = applicationMap.get(item.application);
        if (!app) return; // Skip if not found

        const key = `${app.name} ${app.last_name}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push({ ...item, applicationObject: app });
      });

      // Step 3: Sort each group by application ID and apply suffix
      const groupedWithSortKey = Object.values(grouped).map((group) => {
        group.sort((a, b) => a.applicationObject.id - b.applicationObject.id);
        return {
          sortKey: group[0].applicationObject.id,
          items: group,
        };
      });

      groupedWithSortKey.sort((a, b) => a.sortKey - b.sortKey);

      // Step 4: Build final list
      const updatedDonorList = [];
      groupedWithSortKey.forEach((group) => {
        group.items.forEach((item, index) => {
          const app = item.applicationObject;
          const suffix = index === 0 ? "" : ` (${index + 1})`;
          const displayName = `${app.name} ${app.last_name}${suffix}`;

          updatedDonorList.push({
            ...item,
            displayNameWithOrder: displayName,
          });
        });
      });

      setDonors(donorData);
      setSelectDonorList(updatedDonorList);
      setFilteredDonorList(updatedDonorList);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
  }, []);

  // Filter data
  const filterData = useCallback(() => {
    let filteredData = [...selectDonorList];

    if (studentName) {
      filteredData = filteredData.filter((donor) =>
        donor.displayNameWithOrder
          ?.toLowerCase()
          .includes(studentName.toLowerCase())
      );
    }

    if (selectedDonor) {
      filteredData = filteredData.filter(
        (donor) => donor.donor?.id === selectedDonor
      );
    }

    setFilteredDonorList(filteredData);
  }, [studentName, selectedDonor, selectDonorList]);

  // Handle delete with error handling
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/select-donor/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete donor");
      }

      setSelectDonorList((prev) => prev.filter((app) => app.id !== id));
      setFilteredDonorList((prev) => prev.filter((app) => app.id !== id)); // Also update filtered list
      setDeleteConfirmationOpen(false);
    } catch (err) {
      console.error("Error deleting donor:", err);
      setError("Failed to delete donor. Please try again.");
    }
  };

  // Effect hooks
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  // Event handlers
  const handleEditDialogOpen = (id) => {
    setSelectedDonorId(id);
    setEditDialogOpen(true);
  };

  // Event handlers
  const handleViewDialogOpen = (id) => {
    setSelectedDonorId(id);
    setViewDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchData(); // Re-fetch data to update the table after edit
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
      field: "student",
      headerName: "Student",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.displayNameWithOrder || "",
    },
    {
      field: "donor",
      headerName: "Donor",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row.donor ? (
          <Typography sx={{ fontSize: "12px", color: textColor }}>
            {params.row?.donor?.donor_name}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "12px", color: "#EF4444" }}>
            not selected
          </Typography>
        ),
    },
    {
      field: "selection_date",
      headerName: "Date Since Sponsorship Commenced",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row?.selection_date ? (
          <Typography sx={{ fontSize: "12px", color: textColor }}>
            {params.row?.selection_date}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "12px", color: "#EF4444" }}>
            not selected
          </Typography>
        ),
    },
    {
      field: "edit",
      headerName: "STATUS",
      flex: 1,
      minWidth: 40,
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
            onClick={() => handleEditDialogOpen(params.row.id)}
          >
            Update
          </Button>
        </motion.div>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: "flex", gap: 4 }}
        >
          <Button
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
            size="small"
          >
            Delete
          </Button>
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> */}
          <Button
            size="small"
            variant="contained"
            startIcon={<IoMdEye size={14} />}
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
            onClick={() => handleViewDialogOpen(params.row.id)}
          >
            View
          </Button>
        </motion.div>
      ),
    },
  ];

  if (error) {
    return (
      <Box
        color="error.main"
        p={2}
        sx={{
          color: "#EF4444",
          textAlign: "center",
          fontSize: "16px",
          padding: "20px",
        }}
      >
        {error}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        // paddingTop: "10px",
        backgroundColor: bgColor,
        minHeight: "calc(100vh - 50px)",
        padding: "10px",
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
        {/* Filters */}
        <Box
          sx={{
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", sm: "flex-end" },
            flexGrow: 1, // Allow filters to take available space
            order: { xs: 1, sm: 2 }, // Order for responsiveness
          }}
        >
          <TextField
            label="Search by Student Name"
            variant="outlined" // Changed to outlined for consistency
            size="small"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
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
            <InputLabel sx={{ color: textColor }}>Search by Donor</InputLabel>
            <Select
              value={selectedDonor}
              onChange={(e) => setSelectedDonor(e.target.value)}
              label="Search by Donor"
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
              {donors.map((donor) => (
                <MenuItem key={donor.id} value={donor.id}>
                  {donor.donor_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Add Donor & Select Donor Buttons */}
        <Box
          sx={{
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", sm: "flex-start" },
            order: { xs: 2, sm: 1 }, // Order for responsiveness
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: accentColor,
                color: "white",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#1C3070",
                },
              }}
              onClick={() => setAddDonorDialogOpen(true)}
              endIcon={<AddCircleOutlineIcon />}
            >
              Add Donor
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#21591c", // Specific green from original
                color: "white",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#1A4516",
                },
              }}
              onClick={() => navigate("/Admin/addselectDonor")}
              endIcon={<SelectAllOutlined />}
            >
              Select Donor
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Conditional Grid or Loader */}
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
          />
          <Typography variant="body2" color="textSecondary">
            Loading Donors...
          </Typography>
        </Box>
      ) : (
        <StyledDataGrid
          rows={filteredDonorList}
          columns={columns}
          density="compact"
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          components={{
            Toolbar: CustomToolbar,
          }}
          rowHeight={null} // Let row height be dynamic
          getRowHeight={() => "auto"}
          sx={{
            height: "405px", // Adjusted height for consistency
            minWidth: "300px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            // Consistent shadow
          }}
        />
      )}

      <Dialog
        open={addDonorDialogOpen}
        onClose={() => setAddDonorDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: cardBg, // Match card background
            color: textColor,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DonorCreation onClose={() => setAddDonorDialogOpen(false)} />
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: cardBg, // Match card background
            color: textColor,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <EditSelectDonorForm
          SelectDonorId={selectedDonorId}
          handleCloseDialog={() => setEditDialogOpen(false)}
          handleEditSuccess={handleEditSuccess}
        />
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: cardBg, // Match card background
            color: textColor,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <ViewSelectDonor
          SelectDonorId={selectedDonorId}
          handleCloseDialog={() => setViewDialogOpen(false)}
          // handleEditSuccess={handleEditSuccess}
        />
      </Dialog>

      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={() => handleDelete(deleteId)}
        title="Confirm Delete"
        message="Are you sure you want to delete this select-Donor?"
      />
    </Box>
  );
};

export default AllSelectDonorList;
