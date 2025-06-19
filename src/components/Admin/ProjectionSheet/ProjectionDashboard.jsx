import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../Admin/Applications/AllApplication.module.css";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EducationStatusPopup from "./EducationStatusPopup";
import { Badge, Tooltip, Grid } from "@mui/material";
import { CheckCircle, Error, HourglassEmpty } from "@mui/icons-material";

const ProjectionDashboard = () => {
  const navigate = useNavigate();
  const [Students, setStudents] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const [filterOption, setFilterOption] = useState("dues"); // State for dropdown filter
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [unpaidProjectionCount, setUnpaidProjectionCount] = useState(0); // State for unpaid projection count
  const [paidProjectionCount, setPaidProjectionCount] = useState(0);
  const [duesProjectionCount, setDuesProjectionCount] = useState(0);
  const handleOpenPopup = (studentId) => {
    setSelectedStudentId(studentId); // Set the selected student ID
    setOpenPopup(true); // Open the popup
  };

  const handleClosePopup = () => {
    setOpenPopup(false); // Close the popup
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  useEffect(() => {
    // Fetch applications from the API
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);

        // Calculate the total unpaid projections count
        const unpaidCount = data.reduce((count, student) => {
          const unpaidProjections = student.projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          return count + unpaidProjections.length;
        }, 0);
        setUnpaidProjectionCount(unpaidCount);

        // Calculate the total paid projections count
        const paidCount = data.reduce((count, student) => {
          const paidProjections = student.projections.filter(
            (projection) => projection.status === "Paid"
          );
          return count + paidProjections.length;
        }, 0);
        setPaidProjectionCount(paidCount);

        // Calculate the last unpaid projection that is due
        const duesCount = data.reduce((count, student) => {
          // Filter unpaid projections and check if the fee_due_date is in the past
          const duesProjections = student.projections
            .filter(
              (projection) =>
                projection.status === "Unpaid" &&
                new Date(projection.fee_due_date) < new Date() // Check if the due date has passed
            )
            .sort(
              (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
            ); // Sort by fee_due_date, most recent first

          // If there are any dues, consider only the last one (most recent)
          if (duesProjections.length > 0) {
            count += 1; // Increment count for the last unpaid projection
          }

          return count;
        }, 0);

        setDuesProjectionCount(duesCount);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  const filteredStudents = Students.filter((student) => {
    if (filterOption === "Paid") {
      return student.projections.some(
        (projection) => projection.status === "Paid"
      );
    } else if (filterOption === "Unpaid") {
      return student.projections.some(
        (projection) => projection.status === "Unpaid"
      );
    } else if (filterOption === "dues") {
      const currentDate = new Date();
      return student.projections.some(
        (projection) =>
          projection.status === "Unpaid" &&
          new Date(projection.fee_due_date) < currentDate
      );
    }
    return true; // Default to all students
  });

  const columnss = [
    {
      field: "student_name",
      headerName: "STUDENT",
      flex: 1,
      width: 500,
    },
    {
      field: "semester",
      headerName: "SEMESTER",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        // Assuming `filterOption` is globally available (e.g., via context or props)
        if (filterOption === "Paid") {
          // Filter for Paid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Paid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].semester
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].semester
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0
            ? duesProjections[0].semester
            : null;
        }

        // Default case: return null
        return null;
      },
    },
    {
      field: "tuition_fee",
      headerName: "TUTION FEE",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        if (filterOption === "Paid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].tuition_fee
            : null;
        } else if (filterOption === "Unpaid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].tuition_fee
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].semester
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0
            ? duesProjections[0].tuition_fee
            : null;
        }

        return null;
      },
    },
    {
      field: "other_fee",
      headerName: "OTHER FEE",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        if (filterOption === "Paid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].other_fee
            : null;
        } else if (filterOption === "Unpaid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].other_fee
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].semester
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0
            ? duesProjections[0].other_fee
            : null;
        }

        return null;
      },
    },
    {
      field: "total_cost",
      headerName: "TOTAL COST",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        if (filterOption === "Paid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].total_cost
            : null;
        } else if (filterOption === "Unpaid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].total_cost
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].total_cost
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0
            ? duesProjections[0].total_cost
            : null;
        }

        return null;
      },
    },
    {
      field: "sponsor_name1",
      headerName: "SPONSER NAME",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        if (filterOption === "Paid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].sponsor_name1
            : null;
        } else if (filterOption === "Unpaid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].sponsor_name1
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].sponsor_name1
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0
            ? duesProjections[0].sponsor_name1
            : null;
        }

        return null;
      },
    },
    {
      field: "sponsor_commitment1",
      headerName: "SPONSER COMMITMENT",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        if (filterOption === "Paid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].sponsor_commitment1
            : null;
        } else if (filterOption === "Unpaid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].sponsor_commitment1
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].sponsor_commitment1
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0
            ? duesProjections[0].sponsor_commitment1
            : null;
        }

        return null;
      },
    },

    {
      field: "projection_sheets",
      headerName: "PROJECTIONS",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#304c49" }}
          onClick={() => handleProjectionViewClick(params.row.id)}
          disabled={
            !params.row.applications || params.row.applications.length === 0
          }
        >
          view / edit
        </Button>
      ),
    },
    {
      field: "Bank_details",
      headerName: "BANK DETAILS",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#C04c49" }}
          onClick={() => handleBankDetailButtonClick(params.row.id)}
          disabled={
            !params.row.applications || params.row.applications.length === 0
          }
        >
          Add / edit
        </Button>
      ),
    },

    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      valueGetter: (params) => {
        const projections = params.row.projections;

        if (filterOption === "Paid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Paid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].status
            : null;
        } else if (filterOption === "Unpaid") {
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          return filteredProjections.length > 0
            ? filteredProjections[0].status
            : null;
        } else if (filterOption === "Unpaid") {
          // Filter for Unpaid projections
          const filteredProjections = projections.filter(
            (projection) => projection.status === "Unpaid"
          );

          // Sort by latest date (descending)
          filteredProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );

          // Return the semester of the latest Unpaid projection
          return filteredProjections.length > 0
            ? filteredProjections[0].status
            : null;
        } else if (filterOption === "dues") {
          const currentDate = new Date();
          const duesProjections = projections.filter(
            (projection) =>
              projection.status === "Unpaid" &&
              new Date(projection.fee_due_date) < currentDate
          );

          // Sort the dues projections by fee_due_date in descending order
          duesProjections.sort(
            (a, b) => new Date(b.fee_due_date) - new Date(a.fee_due_date)
          );
          console.log(duesProjections);
          // Return the semester of the last due projection
          return duesProjections.length > 0 ? duesProjections[0].status : null;
        }

        return null;
      },
    },
    {
      field: "education_status",
      headerName: "EDUCATION STATUS",
      width: 200,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#304c49" }}
          onClick={() => handleOpenPopup(params.row.id)}
        >
          Add / Update
        </Button>
      ),
    },
  ];

  const unpaidColumns = [
    {
      field: "student_name",
      headerName: "STUDENT",
      flex: 1,
    },

    {
      field: "unpaid_projections",
      headerName: "UNPAID PROJECTIONS",
      flex: 2,
      renderCell: (params) => {
        const unpaidProjections = params.row.projections.filter(
          (projection) => projection.status === "Unpaid"
        );

        return (
          <ul>
            {unpaidProjections.map((projection, index) => (
              <li key={index}>
                <strong>Semester:</strong> {projection.semester},
                <strong> Due Date:</strong>
                {"   "}
                {new Date(projection.fee_due_date).toLocaleDateString()},
                <strong> Fee:</strong> {projection.total_cost}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      field: "total_unpaid_fees",
      headerName: "TOTAL UNPAID FEES",
      flex: 1,
      valueGetter: (params) => {
        // Safely access projections and filter unpaid ones
        const unpaidProjections =
          params.row.projections?.filter(
            (projection) => projection.status === "Unpaid"
          ) || [];

        // Sum up tuition fees for unpaid projections
        const total = unpaidProjections.reduce(
          (sum, projection) => sum + (parseFloat(projection.total_cost) || 0),
          0
        );

        return total;
      },
    },
    {
      field: "projection_sheets",
      headerName: "PROJECTIONS",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#304c49" }}
          onClick={() => handleProjectionViewClick(params.row.id)}
          disabled={
            !params.row.applications || params.row.applications.length === 0
          }
        >
          view / edit
        </Button>
      ),
    },
    {
      field: "Bank_details",
      headerName: "BANK DETAILS",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#C04c49" }}
          onClick={() => handleBankDetailButtonClick(params.row.id)}
          disabled={
            !params.row.applications || params.row.applications.length === 0
          }
        >
          Add / edit
        </Button>
      ),
    },
  ];

  // Conditionally include columns
  const columns = filterOption === "Unpaid" ? [...unpaidColumns] : columnss;

  const handleProjectionViewClick = (id) => {
    // Navigate to the edit form page with the verification ID
    navigate(`/Admin/ProjectionsOfStudent/${id}`);
  };
  const handleBankDetailButtonClick = (id) => {
    // Navigate to the edit form page with the verification ID
    navigate(`/Admin/BankDetailsByAdmin/${id}`);
  };

  return (
    <div style={{ height: 450, width: "100%", overflowX: "auto" }}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        my={2}
        sx={{
          // padding: 2,
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          width: "100%", // Ensure the Box takes the full width
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          fontWeight="bold"
          sx={{ marginRight: 3, width: 500 }} // Adjust margin for spacing between elements
        >
          Students Projections Dashboard
        </Typography>

        {/* Row for the status indicators and projections count */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid item>
            <Tooltip title="Paid Projections" placement="top">
              <Badge
                color="success"
                badgeContent={paidProjectionCount}
                overlap="circular"
                sx={{ padding: "5px", cursor: "pointer" }}
              >
                <CheckCircle fontSize="large" color="success" />
              </Badge>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Unpaid Projections" placement="top">
              <Badge
                color="warning"
                badgeContent={unpaidProjectionCount}
                overlap="circular"
                sx={{ padding: "5px", cursor: "pointer" }}
              >
                <Error fontSize="large" color="warning" />
              </Badge>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title="Dues Projections" placement="top">
              <Badge
                color="error"
                badgeContent={duesProjectionCount}
                overlap="circular"
                sx={{ padding: "5px", cursor: "pointer" }}
              >
                <HourglassEmpty fontSize="large" color="error" />
              </Badge>
            </Tooltip>
          </Grid>

          {/* Filter Dropdown */}
          <Grid item>
            <FormControl
              variant="outlined"
              sx={{ minWidth: "200px" }}
              margin="normal"
            >
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterOption}
                onChange={handleFilterChange}
                label="Filter by Status"
              >
                <MenuItem value="dues">Dues</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={filteredStudents}
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
          sx={{
            width: "100%",
            backgroundColor: "#f9f9f9",
            "& .MuiDataGrid-cell:hover": { color: "primary.main" },
          }}
        />
      </div>
      <EducationStatusPopup
        open={openPopup}
        handleClose={handleClosePopup}
        studentId={selectedStudentId}
      />
    </div>
  );
};

export default ProjectionDashboard;
