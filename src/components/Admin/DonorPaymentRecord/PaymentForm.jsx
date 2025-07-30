import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function PaymentForm({
  open,
  onClose,
  onSubmit,
  paymentForm,
  setPaymentForm,
  selectedScheduleId,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Make Payment</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          sx={{ mt: 2 }}
          value={paymentForm.amount}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, amount: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Payment Date"
          type="date"
          sx={{ mt: 2 }}
          value={paymentForm.payment_date}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, payment_date: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Method</InputLabel>
          <Select
            value={paymentForm.payment_method}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, payment_method: e.target.value })
            }
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Zelle">Zelle</MenuItem>
            <MenuItem value="Interac e-transfer">Interac e-transfer</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Notes"
          sx={{ mt: 2 }}
          multiline
          rows={2}
          value={paymentForm.notes}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, notes: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
