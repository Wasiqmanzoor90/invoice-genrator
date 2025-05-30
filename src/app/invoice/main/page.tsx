"use client";
import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

const MainInvoice: React.FC = () => {
  return (
    <Box minHeight="100vh" bgcolor="grey.100" py={8}>
      <Box maxWidth="md" mx="auto" px={2}>
        <Paper elevation={2} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No recent invoices
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Click below to create your first invoice.
          </Typography>
          
          <Link href="/invoice/form" passHref>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
            >
              Create Invoice
            </Button>
          </Link>

        </Paper>
      </Box>
    </Box>
  );
};

export default MainInvoice;
