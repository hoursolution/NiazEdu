import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Box, Button, colors, styled, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Applications/ConfirmationDialog"; // Adjust import path as needed
import styles from "../../Admin/Applications/AllApplication.module.css"; // Adjust path as needed
import EducationStatusPopup from "../ProjectionSheet/EducationStatusPopup";
import { MdDelete, MdEdit } from "react-icons/md";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const BASE_URL = "https://zeenbackend-production.up.railway.app";
// const BASE_URL = "http://127.0.0.1:8000";

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

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({ name: "", age: "", city: "" });
  const [openPopup, setOpenPopup] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);

  const handleOpenPopup = (studentId, applicationId) => {
    setSelectedStudentId(studentId);
    setApplicationId(applicationId); // Set the selected student ID
    setOpenPopup(true);
    // Open the popup
  };

  const handleClosePopup = () => {
    setOpenPopup(false); // Close the popup
  };
  const refreshStudents = () => {
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  // Fetch students
  useEffect(() => {
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // Filter students whenever filters or students change
  useEffect(() => {
    const filteredData = students.filter((student) => {
      const nameMatch = filters.name
        ? student.student_name
            ?.toLowerCase()
            .includes(filters.name.toLowerCase())
        : true;
      const ageMatch = filters.age
        ? student.applications[0]?.age?.toString().includes(filters.age)
        : true;
      const cityMatch = filters.city
        ? student.applications[0]?.city
            ?.toLowerCase()
            .includes(filters.city.toLowerCase())
        : true;

      return nameMatch && ageMatch && cityMatch;
    });
    setFilteredStudents(filteredData);
  }, [filters, students]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Delete confirmation handlers
  const handleDeleteConfirmationOpen = (id) => {
    setDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleAddStudentClick = () => {
    navigate("/Admin/addStudents");
  };

  const handleEdit = (id) => {
    navigate(`/Admin/editStudent/${id}`);
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/api/students/${id}/delete/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setStudents((prevStudents) =>
            prevStudents.filter((app) => app.id !== id)
          );
          setDeleteConfirmationClose(); // Close dialog on success
        } else {
          console.error("Failed to delete student");
        }
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const columns = [
    {
      field: "seq_no",
      headerName: "S.No",
      width: 70,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => filteredStudents.indexOf(params.row) + 1,
    },
    {
      field: "full_name",
      headerName: "Name",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) =>
        `${params.row.student_name || ""} ${params.row.last_name || ""}`.trim(),
    },
    // {
    //   field: "application_name",
    //   headerName: "APPLICATION",
    //   width: 120,
    //   renderCell: (params) => (
    //     <Box
    //       style={{
    //         color:
    //           params.row.applications && params.row.applications.length > 0
    //             ? "green"
    //             : "red",
    //       }}
    //     >
    //       {params.row.applications && params.row.applications.length > 0
    //         ? "Submitted"
    //         : "Not Submitted"}
    //     </Box>
    //   ),
    // },
    {
      field: "father_name",
      headerName: "Father Name",
      headerAlign: "center",
      align: "center",
      width: 140,
    },
    // { field: "gender", headerName: "GENDER", width: 80 },
    {
      field: "age",
      headerName: "Age",
      headerAlign: "center",
      align: "center",
      width: 60,
      renderCell: (params) => {
        const name = params.row.applications[0]?.age;
        const isSelected = !!name;

        return (
          <span style={{ color: isSelected ? "#000" : "red" }}>
            {isSelected ? name : " "}
          </span>
        );
      },
    },
    // {
    //   field: "country",
    //   headerName: "COUNTRY",
    //   valueGetter: (params) => params.row.applications[0]?.country || "",
    // },
    // {
    //   field: "city",
    //   headerName: "CITY",
    //   valueGetter: (params) => params.row.applications[0]?.city || "",
    // },
    // {
    //   field: "village",
    //   headerName: "VILLAGE",
    //   valueGetter: (params) => params.row.applications[0]?.village || "",
    // },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (params) => {
        const name = params.row.applications[0]?.address;
        const isSelected = !!name;

        return (
          <span style={{ color: isSelected ? "#000" : "red" }}>
            {isSelected ? name : " "}
          </span>
        );
      },
    },
    {
      field: "mobile_no",
      headerName: "Mobile No",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: (params) => {
        const name = params.row.applications[0]?.mobile_no;
        const isSelected = !!name;

        return (
          <span style={{ color: isSelected ? "#000" : "red" }}>
            {isSelected ? name : " "}
          </span>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (params) => {
        const name = params.row.applications[0]?.email;
        const isSelected = !!name;

        return (
          <span style={{ color: isSelected ? "#000" : "red" }}>
            {isSelected ? name : " "}
          </span>
        );
      },
    },
    {
      field: "applications_count",
      headerName: "App Count",
      width: 90,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.applications?.length || 0,
    },
    {
      field: "education_status",
      headerName: "Education Status",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const studentId = params.row.id;
        const applications = params.row.applications || [];

        if (applications.length === 0) {
          return <span>No Applications</span>;
        }

        return (
          <Box>
            {applications.map((app, index) => (
              <Button
                key={index}
                size="small"
                variant="contained"
                sx={{ backgroundColor: "#304c49", m: 0.5 }}
                onClick={() => handleOpenPopup(studentId, app.id)}
              >
                {app.education_status || `App ${index + 1}`}
              </Button>
            ))}
          </Box>
        );
      },
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
  return (
    <>
      <div style={{ height: 400, width: "99%", paddingTop: "10px" }}>
        <Box
          sx={{
            width: "99%",
            marginBottom: "16px",
            paddingX: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Filter by Name"
              name="name"
              size="small"
              variant="outlined"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <TextField
              label="Filter by Age"
              name="age"
              size="small"
              variant="outlined"
              value={filters.age}
              onChange={handleFilterChange}
            />
            <TextField
              label="Filter by City"
              name="city"
              size="small"
              variant="outlined"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#102c59", textTransform: "capitalize" }}
              onClick={handleAddStudentClick}
            >
              Add New Student
            </Button>
          </Box>
        </Box>

        {/* Data Grid */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <StyledDataGrid
            rows={filteredStudents}
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
        </Box>

        <ConfirmationDialog
          open={deleteConfirmationOpen}
          onClose={handleDeleteConfirmationClose}
          onConfirm={() => {
            handleDelete(deleteId);
            handleDeleteConfirmationClose();
          }}
          title="Confirm Delete"
          message="Are you sure you want to delete this student?"
        />
      </div>
      <EducationStatusPopup
        open={openPopup}
        handleClose={handleClosePopup}
        applicationId={applicationId}
        studentId={selectedStudentId}
        onStatusUpdate={refreshStudents} // Pass the refresh function
      />
    </>
  );
};

export default AllStudents;
