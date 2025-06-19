import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
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

const AllVarification = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${BASE_URL}/api/verifications/`)
      .then((response) => response.json())
      .then((data) => {
        // Group by student full name
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
          <span style={{ color: isSelected ? "#000" : "red" }}>
            {isSelected ? name : "not selected"}
          </span>
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
        const name = params.row.verification_date;
        const isSelected = !!name;

        return (
          <span style={{ color: isSelected ? "#000" : "red" }}>
            {isSelected ? name : "not selected"}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.row.status;
        let buttonColor = "";
        let buttonIcon = null;

        switch (status) {
          case "Accepted by verifier":
            buttonColor = "#4CAF50"; // Green
            buttonIcon = (
              <CheckCircleIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            break;

          case "Pending":
            buttonColor = "#2196F3"; // Blue
            buttonIcon = (
              <ErrorIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            break;

          case "Rejected by verifier":
            buttonColor = "#F44336"; // Red
            buttonIcon = (
              <CancelIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            break;

          default:
            buttonColor = "#9E9E9E"; // Grey
            buttonIcon = null;
        }

        return (
          <Button
            variant="contained"
            startIcon={buttonIcon}
            size="small"
            style={{
              backgroundColor: buttonColor,
              color: "#fff",
              textTransform: "none",
              pointerEvents: "none",
            }}
          >
            {status}
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
          onClick={() => {
            setDeleteId(params.row.id);
            setDeleteConfirmationOpen(true);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 450, width: "99%", paddingTop: "20px" }}>
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
            <MenuItem value="Accepted by verifier">
              Accepted by Verifier
            </MenuItem>
            <MenuItem value="Rejected by verifier">
              Rejected by Verifier
            </MenuItem>
          </Select>
        </FormControl>

        {/* Add Verification Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#102c59",
            marginRight: 1,
          }}
          onClick={() => navigate("/Admin/addVarification")}
        >
          Add Verification
        </Button>
      </Box>

      {/* Data Grid */}
      <Box sx={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap" }}>
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
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={() => {
          handleDelete(deleteId);
          setDeleteConfirmationOpen(false);
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this Verification?"
      />
    </div>
  );
};

export default AllVarification;
