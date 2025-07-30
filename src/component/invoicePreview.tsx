'use client';
import React from "react";
import { Invoice } from "../../types/invoice";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
} from "@mui/material";

interface Props {
  invoice: Invoice;
}

const InvoicePreview: React.FC<Props> = ({ invoice }) => {
  const activeItems = invoice.items.filter(
    item =>
      item.action &&
      item.description.trim() !== "" &&
      (item.quantity > 0 || item.unitPrice > 0)
  );
  const subtotal = activeItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const taxAmount = (invoice.taxRate / 100) * subtotal;
  const total = subtotal + taxAmount;

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 5 },
        maxWidth: 800,
        mx: "auto",
        borderRadius: 3,
        bgcolor: "#fafcff",
        boxShadow: "0 8px 32px 0 rgba(44,62,80,0.08)",
      }}
    >
      <Box textAlign="center" mb={2}>
        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
          sx={{ color: "#23408e", letterSpacing: 1, fontFamily: "serif" }}
        >
          Invoice
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "#d6e0f5" }} />
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={3}
        mb={4}
        sx={{
          background: "#f0f4fb",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box flex={1}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "#23408e",
              borderBottom: "2px solid #3f51b5",
              display: "inline-block",
              mb: 1,
              fontFamily: "serif",
            }}
          >
            Company Information
          </Typography>
          <Typography>Name: <b>{invoice.company.Name}</b></Typography>
          <Typography>Email: {invoice.company.Email}</Typography>
          <Typography>Phone: {invoice.company.Phone}</Typography>
          <Typography>Address: {invoice.company.Adress}</Typography>
        </Box>
        <Box flex={1}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "#23408e",
              borderBottom: "2px solid #3f51b5",
              display: "inline-block",
              mb: 1,
              fontFamily: "serif",
            }}
          >
            Client Information
          </Typography>
          <Typography>Name: <b>{invoice.client.Name}</b></Typography>
          <Typography>Email: {invoice.client.Email}</Typography>
          <Typography>Address: {invoice.client.Address}</Typography>
        </Box>
      </Stack>

      <Table size="small" sx={{ background: "#fff", borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px 0 #d6e0f533" }}>
        <TableHead>
          <TableRow sx={{ background: "#e3eafc" }}>
            <TableCell sx={{ fontWeight: 700, color: "#23408e" }}>Description</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: "#23408e" }}>Qty</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: "#23408e" }}>Unit Price</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: "#23408e" }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activeItems.map((item, index) => (
            <TableRow key={index} sx={{ "&:nth-of-type(even)": { background: "#f6f9fd" } }}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">₹{item.unitPrice.toFixed(2)}</TableCell>
              <TableCell align="right">₹{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={4} textAlign="right">
        <Typography variant="body2" color="text.secondary">
          Subtotal: <b>₹{subtotal.toFixed(2)}</b>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tax ({invoice.taxRate}%): <b>₹{taxAmount.toFixed(2)}</b>
        </Typography>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            color: "#23408e",
            borderTop: "2px solid #3f51b5",
            pt: 1,
            mt: 1,
            fontFamily: "serif",
          }}
        >
          Total: ₹{total.toFixed(2)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={4} mt={3} mb={1}>
        <Typography>
          <strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
        </Typography>
      </Stack>

      {invoice.notes && (
        <Box
          mt={3}
          p={2}
          sx={{
            background: "#fffbe8",
            borderLeft: "4px solid #fbc02d",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#ad9000" mb={1}>
            Notes
          </Typography>
          <Typography color="#8d6e00">{invoice.notes}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default InvoicePreview;