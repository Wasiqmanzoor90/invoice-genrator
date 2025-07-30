"use client";
import React, { useEffect, useState } from "react";
import {  Box, CircularProgress,  Typography,  Alert,Button,  Paper}from "@mui/material"; 
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { useRouter } from "next/navigation";
import isAuthorised from "../../../../utils/isAuthorized";
import InvoiceList from "../list/InvoiceList";
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
        
        // Check authorization first
        const authorized = await isAuthorised();
        if (!authorized) {
          console.log("Not authorized, redirecting...");
          router.push("/");
          return;
        }

        console.log("Authorization passed, fetching invoices..."); // Debug log

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Fetch invoices with better error handling
        const res = await fetch("/api/invoice/user", { 
          method: "GET", 
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log("API Response status:", res.status); // Debug log
        console.log("API Response headers:", Object.fromEntries(res.headers.entries())); // Debug log

        // Handle different HTTP error codes
        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
          
          // Try to get more detailed error from response body
          try {
            const errorData = await res.text();
            if (errorData) {
              console.log("Error response body:", errorData);
              // Try to parse as JSON first
              try {
                const jsonError = JSON.parse(errorData);
                errorMessage = jsonError.message || jsonError.error || errorMessage;
              } catch {
                // If not JSON, use the text
                errorMessage = errorData.substring(0, 200); // Limit length
              }
            }
          } catch (parseError) {
            console.warn("Could not parse error response:", parseError);
          }
          
          throw new Error(errorMessage);
        }

        // Parse response with better error handling
        let data;
        try {
          const responseText = await res.text();
          console.log("Raw response:", responseText); // Debug log
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          throw new Error("Invalid JSON response from server");
        }

        console.log("API Response data:", data); // Debug log
        
        // Process invoices data - handle different response structures
        let invoicesArray = [];
        if (Array.isArray(data)) {
          invoicesArray = data;
        } else if (data?.invoices && Array.isArray(data.invoices)) {
          invoicesArray = data.invoices;
        } else if (data?.data && Array.isArray(data.data)) {
          invoicesArray = data.data;
        } else if (data?.success && data?.invoices) {
          invoicesArray = Array.isArray(data.invoices) ? data.invoices : [];
        } else {
          console.warn("Unexpected API response structure:", data);
          // If we get an object but no clear invoice array, assume empty
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
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to load invoices:", err);
        
        let errorMessage = "Failed to load invoices";
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = "Request timed out - please check your connection";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [router]);

  const handleCreateNew = () => {
    router.push("/invoice/form");
  };

  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    setInvoices([]); // Reset invoices
    
    // Re-run the load function instead of reloading the page
    try {
      const authorized = await isAuthorised();
      if (!authorized) {
        router.push("/");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/invoice/user", { 
        method: "GET", 
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errorData = await res.text();
          if (errorData) {
            try {
              const jsonError = JSON.parse(errorData);
              errorMessage = jsonError.message || jsonError.error || errorMessage;
            } catch {
              errorMessage = errorData.substring(0, 200);
            }
          }
        } catch (parseError) {
          console.warn("Could not parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const responseText = await res.text();
      const data = JSON.parse(responseText);
      
      let invoicesArray = [];
      if (Array.isArray(data)) {
        invoicesArray = data;
      } else if (data?.invoices && Array.isArray(data.invoices)) {
        invoicesArray = data.invoices;
      } else if (data?.data && Array.isArray(data.data)) {
        invoicesArray = data.data;
      } else {
        invoicesArray = [];
      }

      const processedInvoices = invoicesArray.map((invoice: any) => ({
        ...invoice,
        items: (invoice.items || []).map((item: any) => ({
          ...item,
          total: (item.quantity || 0) * (item.unitPrice || 0),
        })),
      }));

      setInvoices(processedInvoices);
      setError(null);
    } catch (err) {
      console.error("Retry failed:", err);
      let errorMessage = "Failed to load invoices";
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = "Request timed out - please check your connection";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
            <Typography variant="body2" sx={{ mt: 1 }}>
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
            onRefresh={handleRetry} // Use handleRetry instead of reload
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