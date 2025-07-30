import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

export default function SubscriptionForm({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  donorName,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Funding Plan for {donorName}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
          >
            <MenuItem value="Niaz Support">Niaz Support</MenuItem>
            <MenuItem value="Subah Sehar">Subah Sehar</MenuItem>
            <MenuItem value="Direct">Direct</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Pledged Amount"
          type="number"
          sx={{ mt: 2 }}
          value={formData.pledged_amount}
          onChange={(e) =>
            setFormData({ ...formData, pledged_amount: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Amount per Period"
          type="number"
          sx={{ mt: 2 }}
          value={formData.amount_per_period}
          onChange={(e) =>
            setFormData({ ...formData, amount_per_period: e.target.value })
          }
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Frequency</InputLabel>
          <Select
            value={formData.payment_frequency}
            onChange={(e) =>
              setFormData({ ...formData, payment_frequency: e.target.value })
            }
          >
            <MenuItem value="one-time">One-Time</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="6-months">Every 6 Months</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
