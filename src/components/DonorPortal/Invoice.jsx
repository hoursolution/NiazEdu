import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Invoice = ({ invoiceData }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Invoice
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Invoice Number: {invoiceData.invoiceNumber}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Date: {invoiceData.date}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Due Date: {invoiceData.dueDate}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="subtitle1" align="right" sx={{ marginTop: 2 }}>
        Total: {calculateTotal(invoiceData.items)}
      </Typography>
    </Paper>
  );
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.amount, 0);
};

export default Invoice;
