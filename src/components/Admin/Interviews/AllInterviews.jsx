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
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  styled,
  colors,
  Dialog,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import { MdDelete, MdEdit } from "react-icons/md";
import ViewInterviewDetails from "./ViewInterviewDetails";

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

const AllInterviews = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]); // For filtering
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // Default empty, shows all
  const [nameFilter, setNameFilter] = useState(""); // Status filter
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [addMentorDialogOpen, setAddMentorDialogOpen] = useState(false);
  const [viewHousehold, setHousehold] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${BASE_URL}/api/interviews/`)
      .then((response) => response.json())
      .then((data) => {
        // Step 1: Group by student full name
        // console.log(data);
        const grouped = {};
        data.forEach((item) => {
          const key = `${item.application.name} ${item.application.last_name}`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(item);
        });

        // Step 2: Map each group to include sortKey (first application ID)
        const groupedWithSortKey = Object.values(grouped).map((group) => {
          // Sort internally by application ID
          group.sort((a, b) => a.application.id - b.application.id);
          return {
            sortKey: group[0].application.id, // use first app ID
            items: group,
          };
        });

        // Step 3: Sort groups by the first application ID
        groupedWithSortKey.sort((a, b) => a.sortKey - b.sortKey);

        // Step 4: Flatten and assign display names with suffix (from 2nd app onward)
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
        console.error("Error fetching interviews:", error);
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
      filtered = filtered.filter((app) => app?.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [nameFilter, statusFilter, applications]);

  const handleViewDetails = (value) => {
    console.log(value);
    setHousehold(value?.row?.interviewer_recommendation);
    setAddMentorDialogOpen(true);
  };

  const handleAddMentorDialogClose = () => {
    setAddMentorDialogOpen(false);
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
      headerName: "Applicant Name",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.displayNameWithOrder || "",
    },
    {
      field: "interviewer_name",
      headerName: "Interviewer Name",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "interview_date",
      headerName: "Interview Date",
      // flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row?.interview_date ? (
          <span>{params.row?.interview_date}</span>
        ) : (
          <span style={{ color: "red" }}>not selected</span>
        ),
    },
    {
      field: "interviewer_recommendation",
      headerName: "Reccomendation",
      // flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let bgColor = "#2196F3"; // default gray

        return (
          <Button
            sx={{
              backgroundColor: bgColor,
              color: "#fff",
              px: "2px",
              py: 0.5,
              borderRadius: 1,
              textAlign: "center",
              width: "60%",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
            onClick={() => handleViewDetails(params)}
          >
            View Details
          </Button>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      // flex: 1,
      minWidth: 210,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.row.status;
        let buttonColor = "";
        let buttonIcon = null;

        switch (status) {
          case "Accepted by interviewer":
            buttonColor = "#4CAF50"; // Green
            buttonIcon = (
              <CheckCircleIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            break;

          case "pending":
            buttonColor = "#2196F3"; // Blue
            buttonIcon = (
              <ErrorIcon style={{ color: "#fff", fontSize: "12px" }} />
            );
            break;

          case "Rejected by interviewer":
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
      headerName: "Interview",
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
    navigate(`/Admin/editInterview/${id}`);
  };

  const handleDeleteConfirmationOpen = (id) => {
    setDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/api/interviews/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setApplications((prevApplications) =>
            prevApplications.filter((app) => app.id !== id)
          );
          setFilteredApplications((prevFiltered) =>
            prevFiltered.filter((app) => app.id !== id)
          ); // Update filtered list
        } else {
          console.error("Failed to delete application");
        }
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
      });
  };

  return (
    <div style={{ height: 400, width: "99%", paddingTop: "20px" }}>
      {/* Filter and Add Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          marginBottom: 2,
          paddingX: { xs: 2, sm: 4 }, // Adjust padding for small and large screens
        }}
      >
        {/* Name Filter */}
        <TextField
          label="Search by Name"
          variant="filled"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{
            width: "40%",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiFilledInput-root": {
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: "#FFFFFF",
              paddingTop: "6px",
              paddingBottom: "6px",
              height: "36px", // adjust height
              "&:before": {
                borderBottom: "none", // remove default bottom border
              },
              "&:after": {
                borderBottom: "none", // remove focused bottom border
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              top: "-6px",
            },
          }}
        />

        {/* Status Filter */}
        <FormControl
          variant="filled"
          sx={{
            width: "20%",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiFilledInput-root": {
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: "#FFFFFF",
              paddingTop: "6px",
              paddingBottom: "6px",
              height: "36px", // adjust height
              "&:before": {
                borderBottom: "none", // remove default bottom border
              },
              "&:after": {
                borderBottom: "none", // remove focused bottom border
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              top: "-6px",
            },
          }}
          size="small"
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="Accepted by interviewer">
              Accepted by interviewer
            </MenuItem>
            <MenuItem value="Rejected by interviewer">
              Rejected by interviewer
            </MenuItem>
          </Select>
        </FormControl>

        {/* Add Interview Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#102c59",
            marginRight: 1,
          }}
          onClick={() => navigate("/Admin/addInterview")}
        >
          Add Interview
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
            height: "450px",
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
        message="Are you sure you want to delete this Interview?"
      />

      {/* add mentor */}
      <Dialog
        fullWidth // Expands to maxWidth
        maxWidth="md"
        open={addMentorDialogOpen}
        onClose={handleAddMentorDialogClose}
      >
        <ViewInterviewDetails
          onClose={handleAddMentorDialogClose}
          viewHousehold={viewHousehold}
        />
      </Dialog>
    </div>
  );
};

export default AllInterviews;
