"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "next/link";
import isAuthorised from "../../../../utils/isAuthorized";
import { useRouter } from "next/navigation";
import InvoicePreview from "@/component/invoicePreview";
import { Invoice } from "../../../../types/invoice";

const MainInvoice: React.FC = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    (async () => {
      if (!await isAuthorised()) return router.push("/");
      try {
        const res = await fetch("/api/invoice/user", { method: "GET", credentials: "include" });
        const data = await res.json();
        setInvoices(
          (data.invoices || []).map((invoice: Invoice) => ({
            ...invoice,
            items: invoice.items.map(item => ({
              ...item,
              total: item.quantity * item.unitPrice,
            })),
          }))
        );
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice.company.Name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #333; background: #f4f8fb;}
            h1 { color: #1a237e; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #fff; border-radius: 6px; overflow: hidden;}
            th, td { border: 1px solid #e0e3e8; padding: 12px 8px; text-align: left; }
            th { background-color: #f4f8fb; font-weight: bold; color: #1a237e;}
            .text-right { text-align: right; }
            .company-client { display: flex; justify-content: space-between; margin: 30px 0; gap: 20px; }
            .company-info, .client-info { width: 45%; background-color: #f8f9fb; padding: 20px; border-radius: 8px; }
            .company-info h3, .client-info h3 { margin-top: 0; color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 5px;}
            .totals { background-color: #f8f9fb; padding: 20px; border-radius: 8px; margin-top: 20px;}
            .final-total { font-size: 1.2em; font-weight: bold; color: #1a237e; border-top: 2px solid #1a237e; padding-top: 10px; margin-top: 10px;}
            hr { border: none; border-top: 2px solid #1a237e; margin: 30px 0; }
            .notes { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 20px;}
            @media print { body { margin: 0; padding: 20px; } .company-client { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <hr>
          <div class="company-client">
            <div class="company-info">
              <h3>Company Information</h3>
              <p><strong>Name:</strong> ${invoice.company.Name}</p>
              <p><strong>Email:</strong> ${invoice.company.Email}</p>
              <p><strong>Phone:</strong> ${invoice.company.Phone}</p>
              <p><strong>Address:</strong> ${invoice.company.Adress}</p>
            </div>
            <div class="client-info">
              <h3>Client Information</h3>
              <p><strong>Name:</strong> ${invoice.client.Name}</p>
              <p><strong>Email:</strong> ${invoice.client.Email}</p>
              <p><strong>Address:</strong> ${invoice.client.Address}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${activeItems
                .map(
                  item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">₹${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals text-right">
            <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
            <p>Tax (${invoice.taxRate}%): ₹${taxAmount.toFixed(2)}</p>
            <div class="final-total">Total: ₹${total.toFixed(2)}</div>
          </div>
          <div style="margin-top: 30px;">
            <p><strong>Issue Date:</strong> ${invoice.issueDate}</p>
            <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
          </div>
          ${
            invoice.notes
              ? `<div class="notes"><h3>Notes</h3><p>${invoice.notes}</p></div>`
              : ""
          }
        </body>
      </html>
    `;

    // Create blob and trigger download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${invoice.company.Name}-${invoice.issueDate}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Open print dialog as well (optional)
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
            Invoices
          </Typography>
          <Divider sx={{ mb: 4 }} />
          {loading ? (
            <CircularProgress color="primary" />
          ) : invoices.length === 0 ? (
            <>
              <Typography variant="h6" color="text.secondary" textAlign="center">
                No recent invoices
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4} textAlign="center">
                Click below to create your first invoice.
              </Typography>
            </>
          ) : (
            invoices.map((invoice) => (
              <Paper
                key={invoice._id.toString()}
                elevation={0}
                sx={{
                  mb: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #e3e6f0",
                  bgcolor: "#fafbfc",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                    {invoice.company?.Name || "Untitled Invoice"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handlePreview(invoice)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(invoice)}
                  >
                    Download
                  </Button>
                </Stack>
              </Paper>
            ))
          )}
          <Divider sx={{ my: 4 }} />
          <Link href="/invoice/form" passHref legacyBehavior>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                py: 1.25,
                fontFamily: "serif",
              }}
            >
              Create Invoice
            </Button>
          </Link>
        </Paper>
      </Box>
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
    </Box>
  );
};

export default MainInvoice;