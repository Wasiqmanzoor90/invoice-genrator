"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";

import { Company, Invoice, Client, InvoiceItems } from "../../types/invoice";
import CompanyinfoForm from "./componyinfoForm";
import ClientinfoForm from "./clientinfoForm";
import InvoiceItem from "./invoiceItems";
import InvoiceDetail from "./invoiceDetail";
import InvoiceGeneratorCard from "./invoiceCard";
import PrintableInvoice from "./invoicePreview";

import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function InvoiceForm() {
  const [company, setCompany] = useState<Company>({
    Name: "",
    Phone: "",
    Email: "",
    Adress: "",
  });

  const [client, setClient] = useState<Client>({
    Name: "",
    Email: "",
    Address: "",
  });

  const [itemss, setItems] = useState<InvoiceItems[]>([
    {
      description: "",
      quantity: 0,
      unitPrice: 0,
      total: 0,
      action: false,
    },
  ]);

  const [invoices, setInvoice] = useState<Invoice>({
    _id: "",
    company: company,
    client: client,
    items: itemss,
    issueDate: "",
    dueDate: "",
    taxRate: 0,
    notes: "",
  });

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInvoice((prev) => ({
      ...prev,
      company,
      client,
      items: itemss,
    }));
  }, [company, client, itemss]);

  const handleSaveDb = async () => {
    // Validate required fields before saving
    if (!company.Name.trim()) {
      alert("Please enter company name");
      return false;
    }
    
    if (!client.Name.trim()) {
      alert("Please enter client name");
      return false;
    }

    const invoiceData = {
      company: company,
      client: client,
      items: itemss,
      issueDate: invoices.issueDate || new Date().toISOString().split('T')[0],
      dueDate: invoices.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      taxRate: invoices.taxRate || 0,
      notes: invoices.notes || "",
    };

    console.log('Sending invoice data:', invoiceData); // Debug log

    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await res.json();
      console.log('Response:', result); // Debug log

      if (!res.ok) {
        console.error("Failed to save invoice:", result.message);
        alert(`Failed to save invoice: ${result.message}`);
        return false;
      }

      // Update the invoice with the saved ID
      setInvoice(prev => ({
        ...prev,
        _id: result.data._id
      }));

      alert("Invoice saved successfully!");
      return true;
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      alert("Failed to save invoice. Please check your connection and try again.");
      return false;
    }
  };

  // Updated react-to-print handler with contentRef
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  // PDF download handler using html2canvas + jsPDF
  const handleDownload = async () => {
    // Save to DB first and wait for completion
    const saved = await handleSaveDb();
    if (!saved) {
      return; // Don't proceed with download if save failed
    }

    if (!printRef.current) return;

    try {
      // Wait a little for render stability
      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f7f8fa", p: 2 }}>
      {/* Buttons to trigger preview print and download PDF */}
      <InvoiceGeneratorCard onPreview={handlePrint} onSave={handleDownload} />

      {/* Your forms for company, client, items, and invoice details */}
      <CompanyinfoForm company={company} onChange={setCompany} />
      <ClientinfoForm client={client} onChange={setClient} />
      <InvoiceItem items={itemss} onChange={setItems} />
      <InvoiceDetail invoice={invoices} onChange={setInvoice} />

      {/* Offscreen but visible container for printable invoice */}
      <Box
        sx={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: "800px",
          backgroundColor: "white",
        }}
      >
        <div ref={printRef}>
          <PrintableInvoice invoice={invoices} />
        </div>
      </Box>

      {/* Optional: Onscreen preview for debugging */}
      {/* <Box sx={{ mt: 4, p: 2, border: "1px solid #ddd" }}>
        <PrintableInvoice invoice={invoices} />
      </Box> */}
    </Box>
  );
}

export default InvoiceForm;