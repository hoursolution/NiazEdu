// InvoicePopup.js
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Card,
  CardContent,
  Box,
} from "@mui/material";

import paidlogo from "../../assets/2.png";

const InvoicePopup = ({ isOpen, onClose, invoiceData }) => {
  const BASE_URL = "http://127.0.0.1:8000";
  // const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const handlePrint = () => {
    window.print();
  };

  const isUrlValid = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Card sx={{ maxWidth: 600, margin: "auto" }}>
          <CardContent>
            {invoiceData && isUrlValid(invoiceData.image) && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {invoiceData.invoiceType === "reciept"
                    ? "Receipt Image"
                    : "Challan Image"}
                </Typography>
                <img src={invoiceData.image} alt="Invoice" />
              </Box>
            )}
            {invoiceData && !isUrlValid(invoiceData.image) && (
              <Typography variant="body1">NOT UPLOADED YET</Typography>
            )}
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        {invoiceData && isUrlValid(invoiceData.image) && (
          <Button variant="outlined" color="error" onClick={handlePrint}>
            Print Invoice
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePopup;
