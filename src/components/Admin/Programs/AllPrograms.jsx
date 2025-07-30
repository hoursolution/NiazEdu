import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";

const AllProgramList = () => {
  const [programsList, setProgramsList] = useState([]);
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
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const columns = [
    {
      field: "name",
      headerName: "PROGRAM NAME",
      flex: 1,
      // valueGetter: (params) => params.row.student.student_name,
    },
    {
      field: "program_type",
      headerName: "PROGRAM TYPE",
      flex: 1,
      // valueGetter: (params) =>
      // params.row.donor ? params.row.donor.donor_name : null,
    },
    { field: "duration_in_months", headerName: "DURATION IN MONTH", flex: 1 },

    {
      field: "edit",
      headerName: "EDIT",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#304c49" }}
          onClick={() => handleEdit(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "DELETE",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          // color="secondary"
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
    <div style={{ height: 400, width: "99%" }}>
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
            backgroundColor: "#1fb8c3",
          }}
          onClick={handleAddClick}
        >
          Add Program
        </Button>
      </Box>

      <DataGrid
        rows={programsList}
        columns={columns}
        pageSize={5}
        classes={{
          columnHeader: styles["custom-datagrid-header"],
        }}
        componentsProps={{
          row: {
            className: styles["row"],
          },
          cell: {
            style: {
              // borderBottom: "2px solid #ffffff", // Apply white border at the bottom of each cell
              // borderRight: "2px solid #ffffff",
              border: "1px solid #ffffff", // Apply white border at the right of each cell
            },
          },
        }}
        className={styles["custom-datagrid"]}
        density="compact"
      />

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
