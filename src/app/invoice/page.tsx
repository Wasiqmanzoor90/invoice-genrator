"use client";
import React, { useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InvoiceForm from "@/component/invoiceForm";

const MainInvoice: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Box minHeight="100vh" bgcolor="grey.100" py={8}>
      <Box maxWidth="md" mx="auto" px={2}>
        {!showForm ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No recent invoices
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Click below to create your first invoice.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              size="large"
            >
              New Invoice
            </Button>
          </Paper>
        ) : (
          <Box>
            <Button onClick={() => setShowForm(false)} sx={{ mb: 2 }}>
              Back
            </Button>
            <InvoiceForm />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MainInvoice;