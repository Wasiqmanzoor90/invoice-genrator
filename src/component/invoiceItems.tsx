"use client";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { InvoiceItems } from "../../types/invoice";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  Typography,
  Button,
} from "@mui/material";

interface Props {
  items: InvoiceItems[];
  onChange: (items: InvoiceItems[]) => void;
}

const InvoiceItemsTable: React.FC<Props> = ({ items, onChange }) => {
  const subtotal = items.filter(i => i.action).reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handleDelete = (idx: number) =>
    onChange(items.map((item, i) => (i === idx ? { ...item, action: false } : item)));

  const handleAddItem = () =>
    onChange([
      ...items,
      { description: "", quantity: 1, unitPrice: 0, total: 0, action: true },
    ]);

  const handleFieldChange = (
    idx: number,
    field: keyof InvoiceItems,
    value: string | number
  ) => {
    const updated = [...items];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
      total:
        field === "quantity"
          ? Number(value) * updated[idx].unitPrice
          : field === "unitPrice"
          ? updated[idx].quantity * Number(value)
          : updated[idx].quantity * updated[idx].unitPrice,
    };
    onChange(updated);
  };

  return (
    <Box sx={{
      width: "98vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      bgcolor: "#f7f8fa",
      py: 4,
    }}>
      <Paper sx={{
        width: "600px",
        p: { xs: 2, md: 4 },
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 4px 20px 0 rgba(31,38,135,.08)",
      }} elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>Invoice Items</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px 0 rgba(59,130,246,.10)",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              px: 3, py: 1,
            }}
            onClick={handleAddItem}
          >Add Item</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>Quantity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>Unit Price</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>Total</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 90 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, idx) =>
              item.action && (
                <TableRow key={idx}>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item.description}
                      onChange={e => handleFieldChange(idx, "description", e.target.value)}
                      placeholder="Item description"
                      InputProps={{ style: { color: "#9ca3af", fontSize: 18, fontWeight: 500 } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      variant="standard"
                      type="number"
                      inputProps={{ min: 1, style: { textAlign: "center" } }}
                      value={item.quantity}
                      onChange={e => handleFieldChange(idx, "quantity", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      variant="standard"
                      type="number"
                      inputProps={{ step: 0.01, min: 0, style: { textAlign: "center" } }}
                      value={item.unitPrice}
                      onChange={e => handleFieldChange(idx, "unitPrice", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    ${Number(item.quantity * item.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(idx)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{
            bgcolor: "#f5f7fa",
            borderRadius: 2,
            px: 4,
            py: 2,
            minWidth: 170,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Typography fontWeight={600} fontSize="1.1rem">
              Subtotal: ${subtotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoiceItemsTable;