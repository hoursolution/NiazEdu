import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Paper,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";

export default function PaymentScheduleTable({
  schedules,
  onPay,
  onEdit,
  onDelete,
}) {
  const [loadingId, setLoadingId] = useState(null);

  const handlePay = async (id) => {
    try {
      setLoadingId(id);
      await onPay(id); // Pass schedule.id
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ fontSize: 12, alignItems: "center" }}
        gutterBottom
        fontWeight="bold"
      >
        Installment Schedule
      </Typography>

      <Table
        sx={{
          "& th": { backgroundColor: "#f9fafb", fontWeight: 600 },
          "& td, & th": { borderBottom: "1px solid #e0e0e0" },
          "& tr:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Due Date</TableCell>
            <TableCell>Expected</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Paid On</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Remaining</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((s) => {
            const expected = Number(s.expected_amount || 0);
            const paid = Number(s.paid_amount || 0);
            const remaining = expected - paid;
            const isOverdue = !s.is_paid && dayjs().isAfter(dayjs(s.due_date));

            return (
              <TableRow key={s.id}>
                <TableCell>{dayjs(s.due_date).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{expected.toFixed(0)}</TableCell>
                <TableCell>{paid.toFixed(0)}</TableCell>
                <TableCell>
                  {s.paid_on ? dayjs(s.paid_on).format("YYYY-MM-DD") : "-"}
                </TableCell>
                <TableCell>{s.method || "-"}</TableCell>
                <TableCell>{s.notes || "-"}</TableCell>
                <TableCell>
                  {s.is_paid ? (
                    <Chip label="Paid" color="success" />
                  ) : (
                    <Chip
                      label="Pending"
                      color={isOverdue ? "error" : "warning"}
                    />
                  )}
                </TableCell>
                <TableCell>{remaining.toFixed(2)}</TableCell>
                <TableCell>
                  {!s.is_paid ? (
                    <Tooltip title="Pay Now">
                      <span>
                        <Button
                          onClick={() => handlePay(s.id)}
                          variant="contained"
                          size="small"
                          disabled={loadingId === s.id}
                          startIcon={
                            loadingId === s.id ? (
                              <CircularProgress size={16} />
                            ) : null
                          }
                        >
                          Pay
                        </Button>
                      </span>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Edit Payment">
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => onEdit(s.payment.id, s.id)}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Payment">
                        <Button
                          size="small"
                          color="error"
                          onClick={() => onDelete(s.payment.id)}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
