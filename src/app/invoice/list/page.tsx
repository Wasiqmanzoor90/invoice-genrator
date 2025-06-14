"use client";
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InvoicePreview from "@/component/invoicePreview";
import { Invoice } from "../../../../types/invoice";

interface InvoiceListProps {
  invoices: Invoice[];
  onCreateNew: () => void;
  onRefresh: () => void;
}

const statusColors: Record<string, any> = {
  Draft: "warning",
  Sent: "primary",
  Paid: "success",
  Overdue: "error",
  Cancelled: "default",
};

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices = [], onCreateNew, onRefresh }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuInvoiceId, setMenuInvoiceId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoiceId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuInvoiceId(invoiceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInvoiceId(null);
  };

  const updateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/invoice/status/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      onRefresh(); // refresh invoice list after update
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      handleMenuClose();
    }
  };

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleDownload = (invoice: Invoice) => {
    const activeItems = invoice.items.filter(
      item => item.action && item.description.trim() && (item.quantity > 0 || item.unitPrice > 0)
    );
    const subtotal = activeItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const taxAmount = (invoice.taxRate / 100) * subtotal;
    const total = subtotal + taxAmount;

    const htmlContent = `<!DOCTYPE html><html><head><title>Invoice - ${invoice.company.Name}</title><style>/* styling omitted for brevity */</style></head><body>...</body></html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${invoice.company.Name}-${invoice.issueDate}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      }
    }, 100);
  };

  if (!invoices) {
    return (
      <Paper elevation={1} sx={{ p: 5, borderRadius: 3, bgcolor: "#fff" }}>
        <Typography variant="h6" color="error" textAlign="center">
          Loading invoices...
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={1} sx={{ p: 5, borderRadius: 3, bgcolor: "#fff" }}>
        <Typography variant="h4" fontWeight={700} mb={3} color="#1a237e" fontFamily="serif" textAlign="center">
          Your Invoices
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {invoices.length === 0 ? (
          <Box textAlign="center" py={6}>
            <ReceiptIcon sx={{ fontSize: 80, color: "#e0e3e8", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" fontWeight={600} mb={2}>
              No invoices found
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} maxWidth={400} mx="auto">
              You haven't created any invoices yet. Start by creating your first invoice to manage your billing and track payments.
            </Typography>
            <Button variant="contained" size="large" color="primary" startIcon={<ReceiptIcon />} onClick={onCreateNew}>
              Create Your First Invoice
            </Button>
          </Box>
        ) : (
          <>
            {invoices.map((invoice) => (
              <Paper
                key={invoice._id.toString()}
                sx={{ mb: 2, p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {invoice.company?.Name || "Untitled Invoice"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={invoice.status} color={statusColors[invoice.status]} size="small" />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, invoice._id.toString())}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  
                  {/* change status */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuInvoiceId === invoice._id.toString()}
                    onClose={handleMenuClose}
                  >
                    {["Paid", "Overdue", "Cancelled"].map((status) => (
                      <MenuItem key={status} onClick={() => updateStatus(invoice._id.toString(), status)}>
                        {status}
                      </MenuItem>
                    ))}
                  </Menu>
                  <Button size="small" variant="outlined" onClick={() => handlePreview(invoice)}>
                    Preview
                  </Button>
                  <Button size="small" variant="contained" onClick={() => handleDownload(invoice)}>
                    Download
                  </Button>
                </Stack>
              </Paper>
            ))}
            <Divider sx={{ my: 4 }} />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              startIcon={<ReceiptIcon />}
              onClick={onCreateNew}
            >
              Create New Invoice
            </Button>
          </>
        )}
      </Paper>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ bgcolor: "#f7fafd" }}>
          {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f7fafd" }}>
          <Button onClick={() => setPreviewOpen(false)} color="primary">
            Close
          </Button>
          {selectedInvoice && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(selectedInvoice)}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoiceList;
