import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import styles from "./AllApplication.module.css";
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

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all
  const [nameFilter, setNameFilter] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  const fetchApplications = () => {
    fetch(`${BASE_URL}/all-applications/`)
      .then((response) => response.json())
      .then((data) => {
        // Sort applications by ID to determine creation order
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
      })
      .catch((error) => console.error("Error fetching applications:", error));
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
        let textColor = "#9E9E9E"; // default grey
        switch (status?.toLowerCase()) {
          case "pending":
            textColor = "#1976D2"; // blue
            break;
          case "accepted":
            textColor = "#388E3C"; // green
            break;
          case "rejected":
            textColor = "#D32F2F"; // red
            break;
        }

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: textColor, fontWeight: 700 }}
            >
              {status || "N/A"}
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<MdEdit size={14} />}
              sx={{
                backgroundColor: "#304c49",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#406c66",
                },
              }}
              onClick={() =>
                navigate(`/Admin/editApplicationsStatus/${params.row.id}`)
              }
            >
              Update
            </Button>
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
        <Button
          size="small"
          variant="contained"
          sx={{
            backgroundColor: "#1976D2",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          onClick={() => navigate(`/Admin/updateApplication/${params.row.id}`)}
        >
          View / Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "DELETE",
      minWidth: 150,
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
            handleDeleteConfirmationOpen(params.row.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto", paddingTop: "20px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          marginBottom: 2,
          marginTop: 1,
          paddingX: { xs: 2, sm: 4 }, // Adjust padding for small and large screens
        }}
      >
        {/* Name Filter */}
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{ width: "30%" }}
        />

        {/* Status Filter */}
        <FormControl sx={{ width: "30%" }} size="small">
          {/* <InputLabel>Status</InputLabel> */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {/* Add Application Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#102c59",
            marginRight: 1,
          }}
          onClick={() => navigate("/Admin/addApplicationss")}
          endIcon={<AddCircleOutlineIcon />}
        >
          Add Application
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
    </div>
  );
};

export default AllApplications;
