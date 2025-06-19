import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Button,
  styled,
  Box,
  Dialog,
} from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

import ViewReports from "./ViewReports";

// Custom GridToolbar with the "Projection" button
const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
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

const Reports = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [addMentorDialogOpen, setAddMentorDialogOpen] = useState(false);
  const [viewHousehold, setHousehold] = useState("");
  const [viewPersonalDetails, setPersonalDetails] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "https://zeenbackend-production.up.railway.app/all-applications/"
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleViewDetails = (value) => {
    console.log(value);
    setHousehold(value?.row?.description_of_household);
    setPersonalDetails(value?.row?.personal_statement);
    setAddMentorDialogOpen(true);
  };

  const handleAddMentorDialogClose = () => {
    setAddMentorDialogOpen(false);
  };

  // / Define the columns for the DataGrid
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
      field: "profile_picture",
      headerName: "Profile Picture",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <img
          src={params.row.profile_picture}
          alt="Profile"
          style={{ width: 80, height: 80, borderRadius: "50%" }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) =>
        `${params.row.name || ""} ${params.row.last_name || ""}`,
    },
    {
      field: "father_name",
      headerName: "Father Name",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const rawDate = params?.row?.date_of_birth;

        const formattedDate = rawDate
          ? new Date(rawDate).toLocaleDateString("en-GB") // 'en-GB' gives dd/mm/yyyy format
          : null;

        return (
          <Typography sx={{ fontSize: "12px" }} variant="body2">
            {formattedDate || (
              <span className="text-red-600 text-[12px]">no date</span>
            )}
          </Typography>
        );
      },
    },
    {
      field: "age",
      headerName: "Age",
      flex: 1,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "province",
      headerName: "Province",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "city_of_origin",
      headerName: "City of Origin",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mobile_no",
      headerName: "Mobile No",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cnic_or_b_form",
      headerName: "CNIC/B-Form",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "village",
      headerName: "Village",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "current_level_of_education",
      headerName: "Current Level of Education",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "institution_interested_in",
      headerName: "Institution Interested In",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {params.value || "no data"}
        </span>
      ),
    },
    {
      field: "program",
      headerName: "Program Interested In",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const value = params.row.program_interested_in?.name;
        return (
          <span style={{ color: !value ? "red" : "inherit" }}>
            {value || "no data"}
          </span>
        );
      },
    },
    {
      field: "admission_fee_of_the_program",
      headerName: "Admission Fee",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "total_fee_of_the_program",
      headerName: "Total Fee",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "living_expenses",
      headerName: "Living Expenses",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "food_and_necessities_expenses",
      headerName: "Food & Necessities",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "transport_amount",
      headerName: "Transport Amount",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "other_amount",
      headerName: "Other Amount",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "expected_sponsorship_amount",
      headerName: "Expected Sponsorship Amount",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "total_members_of_household",
      headerName: "Household Members",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "members_earning",
      headerName: "Earning Members",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "income_per_month",
      headerName: "Income Per Month",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    {
      field: "expense_per_month",
      headerName: "Expense Per Month",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ color: !params.value ? "red" : "inherit" }}>
          {parseFloat(
            parseFloat(params.value || 0).toFixed(0)
          ).toLocaleString() || "no data"}
        </span>
      ),
    },
    // {
    //   field: "description_of_household",
    //   headerName: "Household Description",
    //   flex: 1,
    //   minWidth: 160,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "personal_statement",
    //   headerName: "Personal Statement",
    //   width: 400,
    // },
    {
      field: "description_of_household",
      headerName: "View Household & Personal Statement",
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
      headerName: "Application Status",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.value?.toLowerCase();

        let bgColor = "#9E9E9E"; // default gray

        switch (status) {
          case "accepted":
            bgColor = "#4CAF50"; // green
            break;
          case "pending":
            bgColor = "#2196F3"; // blue
            break;
          case "rejected":
            bgColor = "#F44336"; // red
            break;
          default:
            break;
        }

        return (
          <Box
            sx={{
              backgroundColor: bgColor,
              color: "#fff",
              px: "2px",
              py: 0.5,
              borderRadius: 1,
              textAlign: "center",
              width: "100%",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "verification_required",
      headerName: "Verification Required",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span
          style={{
            color: params.row?.verification_required === true ? "green" : "red",
          }}
        >
          {params.row.verification_required ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "degrees",
      headerName: "Degrees",
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) =>
        params.row.degree
          ?.map(
            (degree) =>
              `${degree.degree_name} (${degree.grade || "N/A"} - ${
                degree.status || "N/A"
              })`
          )
          .join("; ") || "No degrees",
    },
  ];
  // Prepare rows for the DataGrid
  const rows = applications.map((application) => ({
    ...application,
    id: application.id,
  }));

  return (
    <div style={{ width: "100%" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ margin: "20px 0", color: "#14475a", fontWeight: 700 }}
      >
        Applications Data Report
      </Typography>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
        >
          <CircularProgress />
        </div>
      ) : (
        //  {/* Data Grid */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <StyledDataGrid
            rows={rows}
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
              height: "470px",
              minWidth: "300px",
              boxShadow: 5,
              borderRadius: "10px",
              overflow: "hidden", // Hide internal scrollbars
            }}
          />
        </Box>
      )}

      {/* add mentor */}
      <Dialog
        fullWidth // Expands to maxWidth
        maxWidth="md"
        open={addMentorDialogOpen}
        onClose={handleAddMentorDialogClose}
      >
        <ViewReports
          onClose={handleAddMentorDialogClose}
          viewHousehold={viewHousehold}
          viewPersonalDetails={viewPersonalDetails}
        />
      </Dialog>
    </div>
  );
};

export default Reports;
