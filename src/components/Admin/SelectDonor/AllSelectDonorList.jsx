import React, { useState, useEffect, useCallback } from "react";
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
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  styled,
} from "@mui/material";
import DonorCreation from "../Profiles/DonorCreation";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog";
import EditSelectDonorForm from "./EditSelectDonor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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

const BASE_URL = "https://zeenbackend-production.up.railway.app";
// const BASE_URL = "http://127.0.0.1:8000";
const AllSelectDonorList = () => {
  const [selectDonorList, setSelectDonorList] = useState([]);
  const [filteredDonorList, setFilteredDonorList] = useState([]);
  const [donors, setDonors] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [addDonorDialogOpen, setAddDonorDialogOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [selectedDonor, setSelectedDonor] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
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
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    }
  }, []);

  // Filter data
  const filterData = useCallback(() => {
    let filteredData = [...selectDonorList];

    if (studentName) {
      filteredData = filteredData.filter((donor) =>
        donor.student?.student_name
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

  const handleEditSuccess = () => {
    fetchData();
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
          <span>{params.row?.donor?.donor_name}</span>
        ) : (
          <span style={{ color: "red" }}>not selected</span>
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
          <span>{params.row?.selection_date}</span>
        ) : (
          <span style={{ color: "red" }}>not selected</span>
        ),
    },
    {
      field: "edit",
      headerName: "STATUS",
      flex: 1,
      minWidth: 50,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#304c49" }}
          onClick={() => handleEditDialogOpen(params.row.id)}
        >
          Update
        </Button>
      ),
    },
    // {
    //   field: "delete",
    //   headerName: "DELETE",
    //   flex: 1,
    //   minWidth: 50,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => (
    //     <IconButton
    //       aria-label="delete"
    //       size="small"
    //       onClick={() => {
    //         setDeleteId(params.row.id);
    //         setDeleteConfirmationOpen(true);
    //       }}
    //     >
    //       <DeleteForeverIcon sx={{ color: "#c41d1d" }} />
    //     </IconButton>
    //   ),
    // },
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
          onClick={() => {
            setDeleteId(params.row.id);
            setDeleteConfirmationOpen(true);
          }}
          size="small"
        >
          Delete
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <Box color="error.main" p={2}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "99%", height: 400 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
          mt: 1,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#102c59",
              marginRight: 1,
            }}
            onClick={() => setAddDonorDialogOpen(true)}
          >
            Add Donor
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#21591c",
            }}
            onClick={() => navigate("/Admin/addselectDonor")}
          >
            Select Donor
          </Button>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <TextField
            label="Search by Student Name"
            variant="filled"
            size="small"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            sx={{
              width: "50%",
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
          <FormControl
            size="small"
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
          >
            <InputLabel>Search by Donor</InputLabel>
            <Select
              value={selectedDonor}
              onChange={(e) => setSelectedDonor(e.target.value)}
              label="Filter by Donor"
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
      </Box>

      <StyledDataGrid
        rows={filteredDonorList}
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
          height: "420px",
          minWidth: "300px",
          boxShadow: 5,
          borderRadius: "10px",
          overflow: "hidden", // Hide internal scrollbars
        }}
      />
      <Dialog
        open={addDonorDialogOpen}
        onClose={() => setAddDonorDialogOpen(false)}
      >
        <DonorCreation onClose={() => setAddDonorDialogOpen(false)} />
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <EditSelectDonorForm
          SelectDonorId={selectedDonorId}
          handleCloseDialog={() => setEditDialogOpen(false)}
          handleEditSuccess={handleEditSuccess}
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
