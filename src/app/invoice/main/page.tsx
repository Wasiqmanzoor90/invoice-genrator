"use client";
import React, { useEffect, useState } from "react";
import {  Box, CircularProgress,  Typography,  Alert,Button,  Paper}from "@mui/material"; 
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { useRouter } from "next/navigation";
import isAuthorised from "../../../../utils/isAuthorized";
import InvoiceList from "../list/page";
import { Invoice } from "../../../../types/invoice";

const MainInvoice: React.FC = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        console.log("Starting to load invoices..."); // Debug log
        
        // Check authorization
        if (!await isAuthorised()) {
          router.push("/");
          return;
        }

        console.log("Authorization passed, fetching invoices..."); // Debug log

        // Fetch invoices
        const res = await fetch("/api/invoice/user", { 
          method: "GET", 
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("API Response status:", res.status); // Debug log

        if (!res.ok) {
          throw new Error(`Failed to fetch invoices: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("API Response data:", data); // Debug log
        
        // Process invoices data - handle different response structures
        let invoicesArray = [];
        if (Array.isArray(data)) {
          invoicesArray = data;
        } else if (data.invoices && Array.isArray(data.invoices)) {
          invoicesArray = data.invoices;
        } else if (data.data && Array.isArray(data.data)) {
          invoicesArray = data.data;
        } else {
          console.warn("Unexpected API response structure:", data);
          invoicesArray = [];
        }

        const processedInvoices = invoicesArray.map((invoice: any) => ({
          ...invoice,
          items: (invoice.items || []).map((item: any) => ({
            ...item,
            total: (item.quantity || 0) * (item.unitPrice || 0),
          })),
        }));

        console.log("Processed invoices:", processedInvoices); // Debug log
        setInvoices(processedInvoices);
      } catch (err) {
        console.error("Failed to load invoices:", err);
        setError(err instanceof Error ? err.message : "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [router]);

  const handleCreateNew = () => {
    router.push("/invoice/form");
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setInvoices([]); // Reset invoices
    // Re-trigger the useEffect
    window.location.reload();
  };

  const handleViewInvoices = () => {
    setShowList(true);
  };

  const handleBackToMain = () => {
    setShowList(false);
  };

  if (loading) {
    return (
      <Box 
        minHeight="100vh" 
        bgcolor="#f7fafd" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Box textAlign="center">
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" color="text.secondary" mt={2}>
            Loading your invoices...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafd" py={8}>
        <Box maxWidth="sm" mx="auto" px={2}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button onClick={handleRetry} color="error" size="small">
                Retry
              </Button>
            }
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Error Loading Invoices
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{ mt: 2 }}
          >
            Create New Invoice Instead
          </Button>
        </Box>
      </Box>
    );
  }

  // Show invoice list view
  if (showList) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafd" py={4}>
        <Box maxWidth="lg" mx="auto" px={2}>
          <Button
            variant="outlined"
            onClick={handleBackToMain}
            sx={{ mb: 2 }}
          >
            ← Back to Dashboard
          </Button>
          <InvoiceList 
            invoices={invoices} 
            onCreateNew={handleCreateNew}
            onRefresh={() => window.location.reload()} // Pass onRefresh prop
          />
        </Box>
      </Box>
    );
  }

  // Main dashboard view
  return (
    <Box minHeight="100vh" bgcolor="#f7fafd" py={8}>
      <Box maxWidth="sm" mx="auto" px={2}>
        <Paper elevation={1} sx={{ p: 5, borderRadius: 3, bgcolor: "#fff" }}>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={3}
            color="#1a237e"
            fontFamily="serif"
            textAlign="center"
          >
            Invoice Management
          </Typography>
          
          <Box textAlign="center" py={4}>
            <ReceiptIcon sx={{ fontSize: 80, color: "#1a237e", mb: 3 }} />
            
            {invoices.length === 0 ? (
              <>
                <Typography variant="h5" color="text.secondary" fontWeight={600} mb={2}>
                  No invoices yet
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4} maxWidth={400} mx="auto">
                  Start by creating your first invoice to manage your billing and track payments.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNew}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    fontFamily: "serif",
                    mb: 2,
                  }}
                >
                  Create Your First Invoice
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" color="#1a237e" fontWeight={600} mb={2}>
                  You have {invoices.length} invoice{invoices.length > 1 ? 's' : ''}
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4} maxWidth={400} mx="auto">
                  Manage your invoices, view details, and create new ones.
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2} maxWidth={300} mx="auto">
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    startIcon={<ListIcon />}
                    onClick={handleViewInvoices}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1.5,
                      fontFamily: "serif",
                    }}
                  >
                    View All Invoices ({invoices.length})
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNew}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1.5,
                      fontFamily: "serif",
                    }}
                  >
                    Create New Invoice
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MainInvoice;