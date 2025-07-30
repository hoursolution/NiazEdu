import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Skeleton,
  Box,
  Chip,
  useTheme,
  Stack,
  Divider,
  TableContainer,
  TablePagination,
  TextField,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
} from "@mui/material";
import { api } from "./api";
import {
  Paid as PaidIcon,
  Pending as PendingIcon,
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  FileDownload as ExportIcon,
  Add as AddIcon,
  HelpOutline as HelpIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // For Add Donor button
import AddDonor from "./AddDonor";
import { useNavigate } from "react-router-dom";

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

export default function DonorList({ donors, selectedDonor, onSelectDonor }) {
  const [sourceData, setSourceData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "donor_name",
    direction: "asc",
  });

  const [addDonorDialogOpen, setAddDonorDialogOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://niazeducationscholarshipsbackend-production.up.railway.app/api/all-donors-dashboard/?month=${filters.month}&year=${filters.year}`
        );
        const data = await response.json();
        setSourceData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Apply sorting, searching, and filtering to donors
  const processedDonors = useMemo(() => {
    let filteredDonors = [...donors];

    if (searchTerm) {
      filteredDonors = filteredDonors.filter(
        (donor) =>
          donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.donor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.donor_contact.includes(searchTerm)
      );
    }

    if (countryFilter) {
      filteredDonors = filteredDonors.filter(
        (donor) => donor.donor_country === countryFilter
      );
    }

    if (statusFilter) {
      filteredDonors = filteredDonors.filter((donor) =>
        statusFilter === "active" ? donor.active : !donor.active
      );
    }

    if (sortConfig.key) {
      filteredDonors.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredDonors;
  }, [donors, searchTerm, countryFilter, statusFilter, sortConfig]);

  const overallTotals = useMemo(() => {
    return sourceData.reduce(
      (acc, source) => ({
        pledged: acc.pledged + source.total_pledged,
        paid: acc.paid + source.total_paid,
        remaining: acc.remaining + source.total_remaining,
        dues: acc.dues + source.dues_this_month,
        donors: acc.donors + source.breakdown_by_donor.length,
      }),
      {
        pledged: 0,
        paid: 0,
        remaining: 0,
        dues: 0,
        donors: 0,
      }
    );
  }, [sourceData]);

  const handleSourceCardClick = (sourceName) => {
    navigate(`../source-donors/${sourceName}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "None";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
      <MenuItem key={month} value={month}>
        {new Date(2023, month - 1, 1).toLocaleString("default", {
          month: "long",
        })}
      </MenuItem>
    ));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
      (year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      )
    );
  };

  const getSourceColor = (source) => {
    const colorMap = {
      "Subah Sehar": theme.palette.primary.main,
      Direct: theme.palette.secondary.main,
      "Niaz Support": theme.palette.success.main,
      Corporate: theme.palette.warning.main,
      Foundation: theme.palette.info.main,
      Other: theme.palette.grey[600],
    };
    return colorMap[source] || theme.palette.grey[400];
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    try {
      await api.delete(`/donors/${id}/`);
      // setDonors((prev) => prev.filter((donor) => donor.id !== id)); // remove from UI
    } catch (error) {
      console.error("Error deleting donor:", error);
      alert("Failed to delete donor.");
    }
  };

  const renderSourceCard = (source) => (
    <Grid item xs={12} sm={6} md={4} key={source.source}>
      <Card
        elevation={3}
        onClick={() => handleSourceCardClick(source.source)}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderLeft: `4px solid ${getSourceColor(source.source)}`,
          boxShadow: theme.shadows[2],
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: theme.shadows[5] },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={source.source}
              sx={{
                backgroundColor: getSourceColor(source.source),
                color: "white",
                fontWeight: "bold",
                fontSize: "0.8rem",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {source.breakdown_by_donor.length}{" "}
              {source.breakdown_by_donor.length === 1 ? "donor" : "donors"}
            </Typography>
          </Stack>

          <Grid container spacing={1.5}>
            <DashboardMetric
              icon={<WalletIcon sx={{ fontSize: 20 }} />}
              label="Committed"
              value={formatCurrency(source.total_pledged)}
              color={theme.palette.info.main}
            />
            <DashboardMetric
              icon={<PaidIcon sx={{ fontSize: 20 }} />}
              label="Paid"
              value={formatCurrency(source.total_paid)}
              color={theme.palette.success.main}
            />
            <DashboardMetric
              icon={<PendingIcon sx={{ fontSize: 20 }} />}
              label="Remaining"
              value={formatCurrency(source.total_remaining)}
              color={theme.palette.warning.main}
            />
            <DashboardMetric
              icon={<CalendarIcon sx={{ fontSize: 20 }} />}
              label={`Dues (${new Date(
                filters.year,
                filters.month - 1,
                1
              ).toLocaleString("default", { month: "short" })})`}
              value={formatCurrency(source.dues_this_month)}
              color={theme.palette.error.main}
            />
            <DashboardMetric
              icon={<CalendarIcon sx={{ fontSize: 20 }} />}
              label="Next Due"
              value={formatDate(source.next_due_date)}
              color={theme.palette.text.secondary}
            />
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = (format) => {
    console.log(`Exporting to ${format}`);
    // Implement export logic here
  };

  return (
    <Box sx={{ height: "100vh", overflowY: "auto" }}>
      <Container maxWidth="lg" sx={{ py: 4, mt: 3 }}>
        {/* Funding Source Dashboard Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Funding Source Dashboard
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              bgcolor: theme.palette.background.paper,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel sx={{ fontSize: "0.9rem" }}>Month</InputLabel>
                <Select
                  name="month"
                  value={filters.month}
                  label="Month"
                  onChange={handleFilterChange}
                  sx={{
                    borderRadius: 1,
                    bgcolor: theme.palette.grey[50],
                    fontSize: "0.9rem",
                  }}
                >
                  {getMonthOptions()}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel sx={{ fontSize: "0.9rem" }}>Year</InputLabel>
                <Select
                  name="year"
                  value={filters.year}
                  label="Year"
                  onChange={handleFilterChange}
                  sx={{
                    borderRadius: 1,
                    bgcolor: theme.palette.grey[50],
                    fontSize: "0.9rem",
                  }}
                >
                  {getYearOptions()}
                </Select>
              </FormControl>
            </Box>
          </Paper>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <SummaryCard
                  title="Total Committed"
                  value={formatCurrency(overallTotals.pledged)}
                  icon={<WalletIcon fontSize="small" />}
                  color={theme.palette.primary.light}
                />
                <SummaryCard
                  title="Amount Paid"
                  value={formatCurrency(overallTotals.paid)}
                  icon={<PaidIcon fontSize="small" />}
                  color={theme.palette.success.light}
                />
                <SummaryCard
                  title="Remaining"
                  value={formatCurrency(overallTotals.remaining)}
                  icon={<PendingIcon fontSize="small" />}
                  color={theme.palette.warning.light}
                />
                <SummaryCard
                  title="Current Dues"
                  value={formatCurrency(overallTotals.dues)}
                  icon={<CalendarIcon fontSize="small" />}
                  color={theme.palette.error.light}
                />
                <SummaryCard
                  title="Total Donors"
                  value={overallTotals.donors}
                  icon={<PeopleIcon fontSize="small" />}
                  color={theme.palette.info.light}
                />
              </Grid>
            </Grid>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              ))
            ) : sourceData.length > 0 ? (
              sourceData.map(renderSourceCard)
            ) : (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    No funding source data available for the selected period.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
        {/* Donor List Section */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Donors List
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              bgcolor: theme.palette.background.paper,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search donors..."
                variant="outlined"
                size="small"
                sx={{
                  maxWidth: 300,
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    bgcolor: theme.palette.grey[50],
                  },
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{ color: theme.palette.action.active, mr: 1 }}
                    />
                  ),
                }}
              />
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Tooltip title="Filter options">
                  <IconButton
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!countryFilter && !statusFilter}
                    >
                      <FilterIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                {/* <Button
                  startIcon={<ExportIcon />}
                  onClick={() => handleExport("csv")}
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.grey[300],
                    color: theme.palette.grey[700],
                    "&:hover": { backgroundColor: theme.palette.grey[100] },
                    borderRadius: 1,
                    textTransform: "none",
                    px: 2,
                  }}
                >
                  Export
                </Button> */}
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: accentColor,
                    color: "white",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#1C3070",
                    },
                  }}
                  onClick={() => setAddDonorDialogOpen(true)}
                  endIcon={<AddCircleOutlineIcon />}
                >
                  Add Donor
                </Button>
              </Box>
            </Box>
            {showFilters && (
              <Box sx={{ mt: 2, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel sx={{ fontSize: "0.9rem" }}>Country</InputLabel>
                  <Select
                    value={countryFilter}
                    label="Country"
                    onChange={(e) => setCountryFilter(e.target.value)}
                    sx={{
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[50],
                      fontSize: "0.9rem",
                    }}
                  >
                    <MenuItem value="">All Countries</MenuItem>
                    <MenuItem value="PK">Pakistan</MenuItem>
                    <MenuItem value="US">United States</MenuItem>
                    <MenuItem value="UK">United Kingdom</MenuItem>
                    <MenuItem value="AE">UAE</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel sx={{ fontSize: "0.9rem" }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[50],
                      fontSize: "0.9rem",
                    }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Paper>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: theme.shadows[2],
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                  <TableRow>
                    {[
                      { key: "donor_name", label: "Name" },
                      { key: "donor_email", label: "Email" },
                      { label: "Contact" },
                      { label: "CNIC" },
                      { label: "Country" },
                      { label: "Actions", align: "right" },
                    ].map((column, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.text.primary,
                          py: 1,
                          fontSize: "0.9rem",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {column.label}
                          {column.key && (
                            <IconButton
                              size="small"
                              onClick={() => requestSort(column.key)}
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              <SortIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? processedDonors.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : processedDonors
                  ).map((donor) => (
                    <TableRow
                      key={donor.id}
                      selected={selectedDonor === donor.id}
                      sx={{
                        "&:hover": {
                          bgcolor: theme.palette.grey[50],
                          transition: "background-color 0.2s",
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1, fontSize: "0.85rem" }}>
                        {donor.donor_name}
                      </TableCell>
                      <TableCell sx={{ py: 1, fontSize: "0.85rem" }}>
                        {donor.donor_email}
                      </TableCell>
                      <TableCell sx={{ py: 1, fontSize: "0.85rem" }}>
                        {donor.donor_contact}
                      </TableCell>
                      <TableCell sx={{ py: 1, fontSize: "0.85rem" }}>
                        {donor.donor_cnic}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={donor.donor_country || "N/A"}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: theme.palette.grey[300],
                            bgcolor: theme.palette.grey[50],
                            fontSize: "0.8rem",
                            py: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => onSelectDonor(donor.id)}
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                            borderRadius: 1,
                            px: 2,
                            py: 0.5,
                            fontSize: "0.8rem",
                            textTransform: "none",
                          }}
                        >
                          Plan
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(donor.id)}
                          sx={{
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.5,
                            ml: 1,
                            fontSize: "0.8rem",
                            textTransform: "none",
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {processedDonors.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ py: 4, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <HelpIcon
                            sx={{
                              fontSize: 32,
                              color: theme.palette.grey[400],
                            }}
                          />
                          <Typography variant="body2">
                            {searchTerm || countryFilter || statusFilter
                              ? "No matching donors found"
                              : "No donors available"}
                          </Typography>
                          {(searchTerm || countryFilter || statusFilter) && (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => {
                                setSearchTerm("");
                                setCountryFilter("");
                                setStatusFilter("");
                              }}
                              sx={{
                                color: theme.palette.primary.main,
                                textTransform: "none",
                                fontSize: "0.8rem",
                              }}
                            >
                              Clear filters
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={processedDonors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.grey[200]}`,
                bgcolor: theme.palette.background.paper,
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.8rem",
                  },
              }}
            />
          </Paper>
        </Box>
      </Container>

      <Dialog
        open={addDonorDialogOpen}
        onClose={() => setAddDonorDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: cardBg, // Match card background
            color: textColor,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <AddDonor onClose={() => setAddDonorDialogOpen(false)} />
      </Dialog>
    </Box>
  );
}

const SummaryCard = ({ title, value, icon, color }) => (
  <Grid item xs={6} sm={4} md={2.4}>
    <Card
      sx={{
        bgcolor: color,
        color: "common.white",
        borderRadius: 2,
        height: "100%",
        // boxShadow: theme.shadows[2],
        transition: "box-shadow 0.2s",
        // "&:hover": { boxShadow: theme.shadows[5] },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, fontWeight: "medium" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", fontSize: "1rem" }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              p: 1,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Grid>
);

const DashboardMetric = ({ icon, label, value, color }) => (
  <Grid item xs={6}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color, fontSize: 20 }}>{icon}</Box>
        <Typography variant="caption" sx={{ fontSize: "0.8rem" }}>
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: "bold", color, fontSize: "0.9rem" }}
      >
        {value}
      </Typography>
    </Box>
  </Grid>
);
