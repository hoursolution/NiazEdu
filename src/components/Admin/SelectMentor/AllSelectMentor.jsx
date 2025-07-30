import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  styled,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import MentorCreation from "../Profiles/MentorCreation";
import EditSelectMentorForm from "./EditSelectMentor";
import CircularProgress from "@mui/material/CircularProgress";

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

const AllSelectMentorList = () => {
  const [selectMentorList, setselectMentorList] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State to manage the delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // State to store the id of the application to be deleted
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State to manage the visibility of the edit dialog
  const [selectedMentorId, setSelectedMentorId] = useState(null); // State to store the ID of the selected donor
  const navigate = useNavigate();
  const [addMentorDialogOpen, setAddMentorDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  // Function to open the edit dialog
  const handleEditDialogOpen = (id) => {
    setSelectedMentorId(id);
    setEditDialogOpen(true);
  };

  // Function to close the edit dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  // Callback function to close the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    // Fetch applications from the API again after successful edit
    // fetchSelectDonorList();
    setRefresh((prev) => !prev); // toggle to trigger useEffect
  };

  const handleAddMentorClick = () => {
    setAddMentorDialogOpen(true);
  };

  const handleAddMentorDialogClose = () => {
    setAddMentorDialogOpen(false);
  };

  // Function to open the delete confirmation dialog
  const handleDeleteConfirmationOpen = (id) => {
    setDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  // Function to close the delete confirmation dialog
  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleAddClick = () => {
    navigate("/Admin/addselectMentor"); // Navigate to absolute path
  };

  // const handleAddMentorClick = () => {
  //   navigate("/Admin/createMentor"); // Navigate to absolute path
  // };

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/select-mentor/`)
      .then((response) => response.json())
      .then((data) => {
        setselectMentorList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching select-Mentor:", error);
        setLoading(false);
      });
  }, [refresh]); // re-run when edit triggers a refresh

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
      valueGetter: (params) =>
        `${params.row.student.student_name || ""} ${
          params.row.student.last_name || ""
        }`,
    },
    {
      field: "mentor",
      headerName: "Mentor",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row.mentor ? (
          <span>{params.row.mentor.mentor_name}</span>
        ) : (
          <span style={{ color: "red" }}>not selected</span>
        ),
    },
    {
      field: "selection_date",
      headerName: "Date Since Mentor Assigned",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row.mentor ? (
          <span>{params.row.selection_date}</span>
        ) : (
          <span style={{ color: "red" }}>no date</span>
        ),
    },

    {
      field: "edit",
      headerName: "Status",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: accentColor }}
          onClick={() => handleEdit(params.row.id)}
        >
          Update
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      minWidth: 75,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#c41d1d" }}
          onClick={() => handleDeleteConfirmationOpen(params.row.id)}
          size="small"
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleEdit = (id) => {
    // Navigate to the edit form page with the verification ID
    // navigate(`/Admin/editSelectMentor/${id}`);
    handleEditDialogOpen(id);
  };

  const handleDelete = (id) => {
    // Handle delete action, send request to delete application with given id
    fetch(`${BASE_URL}/api/select-mentor/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted application from state
          setselectMentorList((prevApplications) =>
            prevApplications.filter((app) => app.id !== id)
          );
        } else {
          console.error("Failed to delete select mentor instance");
        }
      })
      .catch((error) => {
        console.error("Error deleting select mentor instence:", error);
      });
  };
  return (
    <div style={{ height: 500, width: "99%" }}>
      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "99%",
          mb: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: accentColor, mr: 1 }}
          onClick={handleAddMentorClick}
        >
          Add Mentor
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#21591c" }}
          onClick={handleAddClick}
        >
          Select Mentor
        </Button>
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
            Loading Mentors...
          </Typography>
        </Box>
      ) : (
        <StyledDataGrid
          rows={selectMentorList}
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
            height: "455px", // Adjusted height for consistency
            minWidth: "300px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}

      {/* add mentor */}
      <Dialog open={addMentorDialogOpen} onClose={handleAddMentorDialogClose}>
        <MentorCreation onClose={handleAddMentorDialogClose} />
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        {/* <DialogTitle>Edit Select Donor</DialogTitle> */}
        <EditSelectMentorForm
          SelectMentorId={selectedMentorId}
          handleCloseDialog={handleCloseEditDialog} // Pass the callback function to close the dialog
          handleEditSuccess={handleEditSuccess}
        />
      </Dialog>

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={() => {
          handleDelete(deleteId);
          handleDeleteConfirmationClose();
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this Select-Mentor?"
      />
    </div>
  );
};

export default AllSelectMentorList;
