import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

export default function SubscriptionTable({ subscriptions }) {
  console.log(subscriptions);
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Funding Plan
        </Typography>
      </Box>
      <Table
        sx={{
          "& th": {
            backgroundColor: "#f9fafb",
            fontWeight: 600,
            textAlign: "center",
          },
          "& td": {
            textAlign: "center",
          },
          "& td, & th": {
            borderBottom: "1px solid #e0e0e0",
          },
          "& tr:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Source</TableCell>
            <TableCell align="center">Committed Amount</TableCell>
            <TableCell align="center">Installment Amount</TableCell>
            <TableCell align="center">Frequency</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell align="center">{sub.source}</TableCell>
              <TableCell align="center">
                {sub.pledged_amount}{" "}
                <span style={{ fontSize: "0.75em" }}>PKR</span>
              </TableCell>
              <TableCell align="center">
                {sub.amount_per_period}{" "}
                <span style={{ fontSize: "0.75em" }}>PKR</span>
              </TableCell>
              <TableCell align="center">{sub.payment_frequency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
