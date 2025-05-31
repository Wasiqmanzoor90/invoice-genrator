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
  const subtotal = invoice.items.reduce((acc, item) => acc + item.total, 0);
  const taxAmount = (invoice.taxRate / 100) * subtotal;
  const total = subtotal + taxAmount;

  return (
    <Paper sx={{ p: 4, width: "800px", margin: "auto" }} elevation={3}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Invoice
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h6">Company Info</Typography>
          <Typography>Name: {invoice.company.Name}</Typography>
          <Typography>Email: {invoice.company.Email}</Typography>
          <Typography>Phone: {invoice.company.Phone}</Typography>
          <Typography>Address: {invoice.company.Adress}</Typography>
        </Box>

        <Box>
          <Typography variant="h6">Client Info</Typography>
          <Typography>Name: {invoice.client.Name}</Typography>
          <Typography>Email: {invoice.client.Email}</Typography>
          <Typography>Address: {invoice.client.Address}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell align="right">${item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={3} textAlign="right">
        <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
        <Typography>Tax ({invoice.taxRate}%): ${taxAmount.toFixed(2)}</Typography>
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
      </Box>

      <Box mt={3}>
        <Typography><strong>Issue Date:</strong> {invoice.issueDate}</Typography>
        <Typography><strong>Due Date:</strong> {invoice.dueDate}</Typography>
      </Box>

      {invoice.notes && (
        <Box mt={3}>
          <Typography variant="h6">Notes</Typography>
          <Typography>{invoice.notes}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default InvoicePreview;
