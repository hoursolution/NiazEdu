import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "./api";
import SubscriptionTable from "./SubscriptionTable";
import PaymentScheduleTable from "./PaymentScheduleTable";
import SubscriptionForm from "./SubscriptionForm";
import PaymentForm from "./PaymentForm";
import {
  Container,
  Typography,
  Button,
  Divider,
  Box,
  Paper,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  Add,
  Payments,
  CheckCircle,
  Error,
  CalendarToday,
} from "@mui/icons-material";
import AddCardIcon from "@mui/icons-material/AddCard";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#f5f7fa",
  padding: theme.spacing(1),
  borderRadius: "16px",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(4),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
  overflowY: "auto", // ✅ enables scrolling if needed
  maxHeight: "calc(100vh - 100px)", // ✅ ensures it doesn't exceed viewport
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: accentColor,
  color: "white",
  borderRadius: "8px",
  // padding: theme.spacing(1.5, 3),
  transition: "all 0.3s",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#1565c0",
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
}));

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.04)",
  borderRadius: "12px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(1),
  border: "1px solid rgba(0, 0, 0, 0.08)",
}));

const StatCard = ({ icon, label, value, color }) => (
  <Box
    sx={{
      p: 0,
      borderRadius: 2,
      bgcolor: "background.paper",
      textAlign: "center",
    }}
  >
    <Avatar
      sx={{
        bgcolor: "white",
        color: `${color}.600`,
        mb: 1,
        mx: "auto",
      }}
    >
      {icon}
    </Avatar>
    <Typography
      sx={{
        fontSize: 10,
      }}
      variant="body2"
      color="text.secondary"
      gutterBottom
    >
      {label}
    </Typography>
    <Typography
      variant="h5"
      fontWeight={600}
      sx={{
        fontSize: 10,
      }}
    >
      {/* <AddCardIcon sx={{ fontSize: "inherit", verticalAlign: "middle" }} /> */}
      {value.toLocaleString("en-PK")}
    </Typography>
  </Box>
);

export default function SubscriptionPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [summary, setSummary] = useState({
    total_pledged: 0,
    total_paid: 0,
    remaining: 0,
    overdue_count: 0,
  });

  const [subscriptionFormOpen, setSubscriptionFormOpen] = useState(false);
  const [subscriptionFormData, setSubscriptionFormData] = useState({
    source: "",
    pledged_amount: "",
    amount_per_period: "",
    payment_frequency: "monthly",
    is_active: true,
  });

  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    payment_date: "",
    payment_method: "Cash",
    notes: "",
  });
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  const loadAll = async () => {
    console.log(id);
    try {
      const donorRes = await api.get(`/donors/${id}/`);
      setDonor(donorRes.data);

      const subRes = await api.get(`/subscriptions/?donor=${id}`);
      setSubscriptions(subRes.data);
      console.log(subRes.data);
      let allSchedules = [];
      for (let sub of subRes.data) {
        const sRes = await api.get(`/schedules/?subscription=${sub.id}`);
        allSchedules.push(...sRes.data);
      }
      setSchedules(allSchedules);
      const summaryRes = await api.get(`/donor/${id}/funding_summary/`);
      setSummary(summaryRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadAll();
    console.log("Current donor id:", id);
  }, [id]);

  const handleSaveSubscription = async () => {
    try {
      await api.post("/subscriptions/", {
        ...subscriptionFormData,
        donor: parseInt(id), // ✅ ensure donor ID is passed correctly
      });
      toast.success("Subscription added successfully!");
      setSubscriptionFormOpen(false);
      loadAll(); // reload data after adding
    } catch (error) {
      toast.error("Failed to add subscription");
      console.error(error.response?.data || error.message);
    }
  };

  const handleOpenPaymentForm = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setEditingPaymentId(null);
    setPaymentFormData({
      amount: "",
      payment_date: "",
      payment_method: "Cash",
      notes: "",
    });
    setPaymentFormOpen(true);
  };

  const handleEditPayment = async (paymentId, scheduleId) => {
    try {
      const res = await api.get(`/payments/${paymentId}/`);
      setPaymentFormData({
        amount: res.data.amount,
        payment_date: res.data.payment_date,
        payment_method: res.data.payment_method,
        notes: res.data.notes,
      });
      setSelectedScheduleId(scheduleId);
      setEditingPaymentId(paymentId);
      setPaymentFormOpen(true);
    } catch {
      toast.error("Failed to load payment");
    }
  };

  const handleSubmitPayment = async () => {
    try {
      if (editingPaymentId) {
        await api.put(`/payments/${editingPaymentId}/`, {
          ...paymentFormData,
          schedule: selectedScheduleId,
        });
        toast.success("Payment updated successfully!");
      } else {
        await api.post("/payments/", {
          ...paymentFormData,
          schedule: selectedScheduleId,
        });
        toast.success("Payment recorded successfully!");
      }
      loadAll();
    } catch {
      toast.error("Failed to save payment");
    } finally {
      setPaymentFormOpen(false);
      setEditingPaymentId(null);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await api.delete(`/payments/${paymentId}/`);
      toast.success("Payment deleted successfully!");
      loadAll();
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  return (
    <StyledContainer maxWidth="lg" sx={{ overflowY: "auto" }}>
      {/* header part */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <StyledButton
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ fontSize: 10 }}
        >
          Back
        </StyledButton>

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "text.primary",
          }}
        >
          {donor?.donor_name}'s Donation Plan
        </Typography>

        <StyledButton
          startIcon={<Add />}
          onClick={() => setSubscriptionFormOpen(true)}
          sx={{ fontSize: 12 }}
        >
          New Plan
        </StyledButton>
      </Box>

      {/* cards */}
      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AddCardIcon sx={{ color: "blue" }} />}
              label="Total Committed"
              value={`${summary?.total_pledged || 0} PKR`}

              // color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircle sx={{ color: "green" }} />}
              label="Total Paid"
              value={`${summary?.total_paid || 0} PKR`}

              // color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<HourglassBottomIcon sx={{ color: "#DF1212" }} />}
              label="Remaining "
              value={`${summary?.remaining || 0} PKR`}

              // color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Error sx={{ color: "orange" }} />}
              label="Overdue"
              value={summary?.overdue_count || 0}
              // color="error"
            />
          </Grid>
        </Grid>
      </Card>

      {/* funding plan */}
      <SubscriptionTable subscriptions={subscriptions} />

      <Divider sx={{ my: 4 }}>
        <Chip
          label="Payment Schedule"
          icon={<CalendarToday sx={{ ml: 1 }} />}
          sx={{ px: 2, py: 1 }}
        />
      </Divider>

      {/* instalment schedule */}
      <PaymentScheduleTable
        schedules={schedules}
        onPay={handleOpenPaymentForm}
        onEdit={handleEditPayment}
        onDelete={handleDeletePayment}
      />

      <SubscriptionForm
        open={subscriptionFormOpen}
        onClose={() => setSubscriptionFormOpen(false)}
        onSave={handleSaveSubscription}
        formData={subscriptionFormData}
        setFormData={setSubscriptionFormData}
        selectedDonorId={id}
        donorName={donor?.donor_name || ""}
      />

      <PaymentForm
        open={paymentFormOpen}
        onClose={() => setPaymentFormOpen(false)}
        onSubmit={handleSubmitPayment}
        paymentForm={paymentFormData}
        setPaymentForm={setPaymentFormData}
        selectedScheduleId={selectedScheduleId}
      />
    </StyledContainer>
  );
}
