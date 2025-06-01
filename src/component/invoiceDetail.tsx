"use client";
import React from "react";
import { Invoice } from "../../types/invoice";
import { Box, Paper, TextField, Typography } from "@mui/material";

interface Props {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

const InvoiceDetail: React.FC<Props> = ({ invoice, onChange }) => {
  return (
    <Box
      sx={{
        width: "98vw",
        display: "flex",
        justifyContent: "center",
        bgcolor: "#f7f8fa",
      }}
    >
      <Paper
        sx={{
          width: "600px",
          p: { xs: 2, md: 4 },
          bgcolor: "#fff",
        }}
        elevation={0}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Invoice Detail
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
          <Typography sx={{ fontWeight: 600, mt: 0.8 }}>
            Issue Date <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              type="date"
              value={invoice.issueDate}
              onChange={(e) =>
                onChange({ ...invoice, issueDate: e.target.value })
              }
             
              fullWidth
              required
            />
          </Box>

          <Box>
          <Typography sx={{ fontWeight: 600, mt: 0.8 }}>
            Due Date <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              type="date"
              value={invoice.dueDate}
              onChange={(e) =>
                onChange({ ...invoice, dueDate: e.target.value })
              }
              
              fullWidth
              required
            />
          </Box>

          <Box>
          <Typography sx={{ fontWeight: 600, mt: 0.8 }}>
            Tax Rate (%) <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              type="number"
              value={invoice.taxRate}
              onChange={(e) =>
                onChange({ ...invoice, taxRate: parseFloat(e.target.value) })
              }
             
              fullWidth
              required
            />
          </Box>

          <Box>
          <Typography sx={{ fontWeight: 600, mt: 0.8 }}>
            Notes
            </Typography>
            <TextField
              variant="standard"
              value={invoice.notes || ""}
              onChange={(e) => onChange({ ...invoice, notes: e.target.value })}
              label="Notes"
              fullWidth
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
export default InvoiceDetail;