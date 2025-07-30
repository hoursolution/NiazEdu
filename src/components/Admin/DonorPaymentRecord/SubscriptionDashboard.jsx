import React, { useState, useEffect } from "react";
import { api } from "./api";
import DonorList from "./DonorList";
import SubscriptionForm from "./SubscriptionForm";
import SubscriptionTable from "./SubscriptionTable";
import PaymentScheduleTable from "./PaymentScheduleTable";
import PaymentForm from "./PaymentForm";
import { Container, Typography, Divider } from "@mui/material";
import { toast } from "react-toastify";

export default function SubscriptionDashboard() {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [schedules, setSchedules] = useState([]);

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

  useEffect(() => {
    api
      .get("/donor/")
      .then((res) => setDonors(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDonor) {
      api
        .get(`/subscriptions/?donor=${selectedDonor}`)
        .then((res) => setSubscriptions(res.data));
    }
  }, [selectedDonor]);

  useEffect(() => {
    if (subscriptions.length > 0) {
      const fetchAllSchedules = async () => {
        let all = [];
        for (let sub of subscriptions) {
          const res = await api.get(`/schedules/?subscription=${sub.id}`);
          all.push(...res.data);
        }
        setSchedules(all);
      };
      fetchAllSchedules();
    }
  }, [subscriptions]);

  const refreshSchedules = async () => {
    let all = [];
    for (let sub of subscriptions) {
      const res = await api.get(`/schedules/?subscription=${sub.id}`);
      all.push(...res.data);
    }
    setSchedules(all);
  };

  const handleSaveSubscription = async () => {
    await api.post("/subscriptions/", {
      ...subscriptionFormData,
      donor: selectedDonor,
    });
    setSubscriptionFormOpen(false);
    const res = await api.get(`/subscriptions/?donor=${selectedDonor}`);
    setSubscriptions(res.data);
  };

  const handleOpenPaymentForm = (scheduleId) => {
    setSelectedScheduleId(scheduleId); // Store for creation
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
      setSelectedScheduleId(scheduleId); // Store for update
      setEditingPaymentId(paymentId);
      setPaymentFormOpen(true);
    } catch (err) {
      toast.error("Failed to load payment");
    }
  };

  const handleSubmitPayment = async () => {
    try {
      if (editingPaymentId) {
        await api.put(`/payments/${editingPaymentId}/`, {
          ...paymentFormData,
          schedule: selectedScheduleId, // Must always be passed
        });
        toast.success("Payment updated!");
      } else {
        await api.post("/payments/", {
          ...paymentFormData,
          schedule: selectedScheduleId,
        });
        toast.success("Payment created!");
      }
      await refreshSchedules();
    } catch {
      toast.error("Failed to save payment");
    } finally {
      setEditingPaymentId(null);
      setPaymentFormOpen(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await api.delete(`/payments/${paymentId}/`);
      toast.success("Payment deleted!");
      await refreshSchedules();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, px: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <Typography variant="h4" gutterBottom>
        🎁 Donor Payment Dashboard
      </Typography>

      <DonorList
        donors={donors}
        selectedDonor={selectedDonor}
        onSelectDonor={setSelectedDonor}
        onCreateSubscription={(id) => {
          setSelectedDonor(id);
          setSubscriptionFormOpen(true);
        }}
      />

      <Divider sx={{ my: 2 }} />
      <SubscriptionTable subscriptions={subscriptions} />
      <Divider sx={{ my: 2 }} />

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
        selectedDonorId={selectedDonor}
        donorName={
          donors.find((d) => d.id === Number(selectedDonor))?.donor_name || ""
        }
      />

      <PaymentForm
        open={paymentFormOpen}
        onClose={() => setPaymentFormOpen(false)}
        onSubmit={handleSubmitPayment}
        paymentForm={paymentFormData}
        setPaymentForm={setPaymentFormData}
        selectedScheduleId={selectedScheduleId}
      />
    </Container>
  );
}
