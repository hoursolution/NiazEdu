import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css";
import { Box, Button, styled, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import { MdDelete, MdEdit } from "react-icons/md";

// Custom GridToolbar with the "Projection" button
const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
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

const AllProgramList = () => {
  const [programsList, setProgramsList] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State to manage the delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // State to store the id of the application to be deleted
  const navigate = useNavigate();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

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
    navigate("/Admin/addProgram"); // Navigate to absolute path
  };

  useEffect(() => {
    // Fetch applications from the API
    fetch(`${BASE_URL}/api/Programs/`)
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched applications to state
        setProgramsList(data);
        setFilteredApplications(data);

        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  // Function to filter applications based on selected status
  useEffect(() => {
    let filtered = programsList;

    if (nameFilter) {
      filtered = filtered.filter((app) =>
        `${app.name}`.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [nameFilter]);

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
      headerName: "Program Name",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
      // valueGetter: (params) => params.row.student.student_name,
    },
    {
      field: "program_type",
      headerName: "Program Type",
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) =>
        params.row.program_type ? params.row.program_type : null,
    },
    {
      field: "duration_in_months",
      headerName: "Duration In Months",
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "edit",
      headerName: "Edit",
      minWidth: 100,
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
          Edit
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
          onClick={() => {
            setDeleteConfirmationOpen(true);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleEdit = (id) => {
    // Navigate to the edit form page with the verification ID
    navigate(`/Admin/editProgram/${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete action, send request to delete application with given id
    fetch(`${BASE_URL}/api/Programs/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted application from state
          setProgramsList((prevPrograms) =>
            prevPrograms.filter((app) => app.id !== id)
          );
        } else {
          console.error("Failed to delete select donor instance");
        }
      })
      .catch((error) => {
        console.error("Error deleting select donor instence:", error);
      });
  };
  return (
    <div style={{ height: 400, width: "99%", paddingTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 1,
          width: "99%",
          marginBottom: 1,
          paddingX: "20px",
        }}
      >
        {/* Name Filter */}
        <TextField
          label="Search by Program Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{ width: "50%" }}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#102c59",
            marginRight: 1,
          }}
          onClick={handleAddClick}
        >
          Add Program
        </Button>
      </Box>

      {/* Data Grid */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <StyledDataGrid
          rows={filteredApplications}
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
            height: "440px",
            minWidth: "300px",
            boxShadow: 5,
            borderRadius: "10px",
            overflow: "hidden", // Hide internal scrollbars
          }}
        />
      </Box>

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
        onConfirm={() => {
          handleDelete(deleteId);
          handleDeleteConfirmationClose();
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this select-Donor?"
      />
    </div>
  );
};

export default AllProgramList;
