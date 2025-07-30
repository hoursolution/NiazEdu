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
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const BASE_URL =
  "https://niazeducationscholarshipsbackend-production.up.railway.app";
// const BASE_URL = "http://127.0.0.1:8000";

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

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteConfirmationClose, setDeleteConfirmationClose] = useState(true);
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
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  };

  // Fetch students
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
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
          handleDeleteConfirmationClose(); // Close dialog on success
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
      field: "cnic",
      headerName: "B-Form / CNIC",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (params) => {
        const name = params.row.cnic;
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
        const name = params.row?.email;
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
            backgroundColor: accentColor,
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
          onClick={() => handleDeleteConfirmationOpen(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];
  return (
    <>
      <div style={{ height: "100%", width: "99%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            marginBottom: 3,
            padding: 2,
            backgroundColor: cardBg, // Card background for filters/button
            borderRadius: "8px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <TextField
            label="Filter by Name"
            name="name"
            variant="outlined" // Changed to outlined for consistency
            size="small"
            sx={{
              width: { xs: "50%", sm: "50%" },
              "& .MuiOutlinedInput-root": {
                color: textColor,
                "& fieldset": { borderColor: textColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputLabel-root": {
                color: textColor,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: accentColor,
              },
            }}
            value={filters.name}
            onChange={handleFilterChange}
          />
          <TextField
            label="Filter by Age"
            name="age"
            variant="outlined" // Changed to outlined for consistency
            size="small"
            sx={{
              width: { xs: "50%", sm: "50%" },
              "& .MuiOutlinedInput-root": {
                color: textColor,
                "& fieldset": { borderColor: textColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputLabel-root": {
                color: textColor,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: accentColor,
              },
            }}
            value={filters.age}
            onChange={handleFilterChange}
          />
          <TextField
            label="Filter by City"
            name="city"
            variant="outlined" // Changed to outlined for consistency
            size="small"
            sx={{
              width: { xs: "50%", sm: "50%" },
              "& .MuiOutlinedInput-root": {
                color: textColor,
                "& fieldset": { borderColor: textColor },
                "&:hover fieldset": { borderColor: accentColor },
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
              "& .MuiInputLabel-root": {
                color: textColor,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: accentColor,
              },
            }}
            value={filters.city}
            onChange={handleFilterChange}
          />
          <Button
            variant="contained"
            sx={{
              width: { xs: "50%", sm: "50%" },

              backgroundColor: accentColor,
              textTransform: "capitalize",
            }}
            onClick={handleAddStudentClick}
          >
            Add New Student
          </Button>
        </Box>

        {/* Data Grid */}
        {loading ? (
          <Box
            sx={{
              height: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress
              size={40}
              thickness={4}
              style={{ color: accentColor }}
            />
            <Typography variant="body2" color="textSecondary">
              Loading Students...
            </Typography>
          </Box>
        ) : (
          <StyledDataGrid
            rows={filteredStudents}
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
              height: "420px", // Adjusted height for consistency
              minWidth: "300px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          />
        )}

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
