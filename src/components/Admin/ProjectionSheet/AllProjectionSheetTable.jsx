import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography, Button } from "@mui/material";
import styles from "../../DonorPortal/ProjectionSheetTable.module.css";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
const AllProjectionSheetTable = ({ studentId, refreshFlag }) => {
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [studentDetails, setStudentDetails] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State to manage the delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // State to store the id
  const [projections, setProjections] = useState([]);

  const handleDelete = (id) => {
    // Handle delete action, send request to delete application with given id
    fetch(`${BASE_URL}/api/projections/${id}/delete/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted application from state
          setProjections((prevProjections) =>
            prevProjections.filter((projection) => projection.id !== id)
          );
        } else {
          console.error("Failed to delete projection instance");
        }
      })
      .catch((error) => {
        console.error("Error deleting projection instance:", error);
      });
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    { field: "semester", headerName: "Semester / Month", width: 140 },
    { field: "tuition_fee", headerName: "Tuition Fee (PKR)", width: 150 },
    { field: "other_fee", headerName: "Other Fee", width: 150 },
    { field: "total_cost", headerName: "Total Cost", width: 150 },
    {
      field: "sponsor_name1",
      headerName: "Sponsor 1",
      width: 150,
    },
    {
      field: "sponsor_commitment1",
      headerName: "Commitment 1 (RS)",
      width: 150,
    },
    {
      field: "sponsor_percent1",
      headerName: "Percent 1 (%)",
      width: 150,
    },
    { field: "fee_due_date", headerName: "Fee Due Date", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "payment_date", headerName: "Payment Date", width: 150 },
    {
      field: "edit",
      headerName: "EDIT",
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#304c49" }}
          onClick={() => handleEditProjectionViewClick(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "DELETE",
      width: 120,
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
  // Check if sponsor name two exists in any projection
  const sponsorNameTwoExists = projections.some(
    (projection) => projection.sponsor_name2
  );

  // Add sponsor two details to columns if sponsor name two exists
  if (sponsorNameTwoExists) {
    columns.splice(
      7,
      0, // Insert sponsor two details after sponsor_commitment1
      {
        field: "sponsor_name2",
        headerName: "Sponsor 2nd",
        width: 150,
      },
      {
        field: "sponsor_commitment2",
        headerName: "Commitment 2 (RS) ",
        width: 150,
      },
      {
        field: "sponsor_percent2",
        headerName: "Percent 2 (%)",
        width: 150,
      }
    );
  }

  const navigate = useNavigate();

  const handleEditProjectionViewClick = (id) => {
    // Navigate to the edit form page with the verification ID
    navigate(`/Admin/editProjections/${id}`);
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

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !studentId) {
          console.error("Token not available or missing studentId.");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/api/studentDetails/${studentId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Error fetching student details:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Student details:", data);
        setStudentDetails(data);
        setProjections(data.projections || []);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId, refreshFlag]);

  return (
    <Paper elevation={6} sx={{ marginTop: "3px", width: "99%" }}>
      <Box
        sx={{
          height: 400,
          width: "100%",
          marginTop: 0,
          maxHeight: "320px",
          overflowX: "auto",
        }}
        className="Projectionsheet-table"
      >
        <DataGrid
          rows={projections}
          columns={columns}
          sortModel={[
            {
              field: "semester",
              sort: "asc",
            },
          ]}
          density="compact"
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
          pageSize={5}
          // checkboxSelection
          disableRowSelectionOnClick
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
        message="Are you sure you want to delete this Projection?"
      />
    </Paper>
  );
};

export default AllProjectionSheetTable;
