// ============= INVOICE ITEMS TABLE =============
"use client";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Box, IconButton, Paper, Table, TableCell, TableHead, 
  TableRow, TableBody, TextField, Typography, Button,
} from "@mui/material";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  action: boolean;
}

interface ItemsProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}

const InvoiceItemsTable: React.FC<ItemsProps> = ({ items, onChange }) => {
  // Calculate subtotal from all active items
  const calculateSubtotal = () => {
    return items
      .filter(item => item.action)
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const subtotal = calculateSubtotal();

  // Remove an item from the list
  const deleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  // Add a new empty item to the list
  const addItem = () => {
    const newItem = { 
      description: "", 
      quantity: 1, 
      unitPrice: 0, 
      total: 0, 
      action: true 
    };
    onChange([...items, newItem]);
  };

  // Update a specific field of an item
  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total when quantity or unit price changes
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    onChange(updatedItems);
  };

  return (
    <Box sx={{ width: "98vw", display: "flex", justifyContent: "center", bgcolor: "#f7f8fa", py: 4 }}>
      <Paper sx={{ width: "600px", p: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(31,38,135,0.08)" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>Invoice Items</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Add Item
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>Quantity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>Unit Price (₹)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>Total (₹)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, width: 90 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => 
              item.action && (
                <TableRow key={index}>
                  <TableCell>
                    <TextField fullWidth variant="standard" value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Item description" />
                  </TableCell>
                  <TableCell align="center">
                    <TextField variant="standard" type="number" value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      inputProps={{ min: 1, style: { textAlign: "center" } }} />
                  </TableCell>
                  <TableCell align="center">
                    <TextField variant="standard" type="number" value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                      inputProps={{ step: 0.01, min: 0, style: { textAlign: "center" } }} />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    ₹{(item.quantity * item.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => deleteItem(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 4, py: 2, textAlign: "center" }}>
            <Typography fontWeight={600} fontSize="1.1rem">
              Subtotal: ₹{subtotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoiceItemsTable;