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
import { MdDelete, MdEdit } from "react-icons/md";

// Custom GridToolbar with the "Projection" button
const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport /> */}
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

const AllSelectMentorList = () => {
  const [selectMentorList, setselectMentorList] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State to manage the delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // State to store the id of the application to be deleted
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State to manage the visibility of the edit dialog
  const [selectedMentorId, setSelectedMentorId] = useState(null); // State to store the ID of the selected donor
  const navigate = useNavigate();
  const [addMentorDialogOpen, setAddMentorDialogOpen] = useState(false);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

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
    // Fetch applications from the API
    fetch(`${BASE_URL}/api/select-mentor/`)
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched applications to state
        setselectMentorList(data);
      })
      .catch((error) => {
        console.error("Error fetching select-Mentor:", error);
      });
  }, [handleEditSuccess]); // Empty dependency array ensures the effect runs only once on component mount

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
      minWidth: 50,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          startIcon={<MdEdit size={14} />}
          sx={{
            backgroundColor: "#304c49",
            textTransform: "capitalize", // Optional: keeps "Update" in normal case

            "&:hover": {
              backgroundColor: "#406c66", // Optional: darker on hover
            },
          }}
          onClick={() => handleEdit(params.row.id)}
        >
          Update
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          startIcon={<MdDelete size={14} />}
          sx={{
            backgroundColor: "#c41d1d",
            textTransform: "capitalize", // Optional: keeps "Update" in normal case

            "&:hover": {
              backgroundColor: "#406c66", // Optional: darker on hover
            },
          }}
          onClick={() => handleDeleteConfirmationOpen(params.row.id)}
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
    <div style={{ height: 400, width: "99%", paddingTop: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 1,
          width: "99%",
          marginBottom: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#102c59",
            marginRight: 1,
          }}
          onClick={handleAddMentorClick}
        >
          Add Mentor
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#21591c",
          }}
          onClick={handleAddClick}
        >
          Select Mentor
        </Button>
      </Box>

      <StyledDataGrid
        rows={selectMentorList}
        columns={columns}
        density="compact"
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        // loading={loading}
        components={{
          Toolbar: () => <CustomToolbar />,
        }}
        rowHeight={null} // Let row height be dynamic
        getRowHeight={() => "auto"}
        sx={{
          height: "460px",
          minWidth: "300px",
          boxShadow: 5,
          borderRadius: "10px",
          overflow: "hidden", // Hide internal scrollbars
        }}
      />

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
