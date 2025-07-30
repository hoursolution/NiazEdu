import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Container } from "lucide-react";

const DonorsBySourceTable = () => {
  const { source } = useParams();
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://niazeducationscholarshipsbackend-production.up.railway.app/api/donors-by-source/?source=${encodeURIComponent(
            source
          )}&month=${filters.month}&year=${filters.year}`
        );
        const data = await res.json();
        setDonors(data.donors || []);
      } catch (error) {
        console.error("Failed to fetch donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [source, filters]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount || 0);

  const handlePlanClick = (donorId) => {
    navigate(`/Admin/donors/${donorId}/plan`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Box sx={{ marginTop: "-200px" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎯 Donors by Source:{" "}
        <span style={{ color: "#1976d2" }}>{decodeURIComponent(source)}</span>
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                label="Month"
              >
                {months.map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                label="Year"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <MenuItem key={yr} value={yr}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="30vh"
        >
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "white" }}>Donor Name</TableCell>
                <TableCell sx={{ color: "white" }}>Pledged</TableCell>
                <TableCell sx={{ color: "white" }}>Paid</TableCell>
                <TableCell sx={{ color: "white" }}>Remaining</TableCell>
                <TableCell sx={{ color: "white" }}>Dues (This Month)</TableCell>
                <TableCell sx={{ color: "white" }}>Overdues</TableCell>
                <TableCell sx={{ color: "white" }}>Next Due Date</TableCell>
                <TableCell sx={{ color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor.donor_id} hover>
                  <TableCell>{donor.donor_name}</TableCell>
                  <TableCell>{formatCurrency(donor.total_pledged)}</TableCell>
                  <TableCell>{formatCurrency(donor.total_paid)}</TableCell>
                  <TableCell>{formatCurrency(donor.total_remaining)}</TableCell>
                  <TableCell>{formatCurrency(donor.dues_this_month)}</TableCell>
                  <TableCell
                    sx={{ color: donor.overdues > 0 ? "#d32f2f" : "inherit" }}
                  >
                    {formatCurrency(donor.overdues)}
                  </TableCell>
                  <TableCell>{donor.next_due_date || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handlePlanClick(donor.donor_id)}
                      sx={{ borderRadius: 5, textTransform: "none" }}
                    >
                      Plan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default DonorsBySourceTable;
