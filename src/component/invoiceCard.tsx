
"use client";
import React from 'react';
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";

interface Props {
  onPreview: () => void;
  onSave: () => void;
}

const InvoiceGeneratorCard: React.FC<Props> = ({ onPreview, onSave }) => (
  <Box
    sx={{
      
      width: "98vw",
      display: "flex",
     
      justifyContent: "center",
      bgcolor: "#f7f8fa",
      py: 4,
    }}
  >
    <Paper
      sx={{
        width: "600px",
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          
          marginBottom:'20px',
          bgcolor: "#fff",
      }}
      elevation={0}
    >
      <Typography variant="h4" fontWeight={500} mb={1.5}>
        Invoice Generator
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Create professional invoices with ease
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center">
        <Button
          variant="contained"
          color="inherit"
          size="large"
          sx={{
            bgcolor: "#374151",
            color: "#fff",
            "&:hover": { bgcolor: "#1f2937" },
            fontWeight: 600,
            px: 3,
            fontSize: "1.05rem",
            boxShadow: "none",
          }}
          startIcon={<VisibilityIcon />}
          onClick={onPreview}
        >
          Preview Invoice
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            bgcolor: "#2563eb",
            color: "#fff",
            "&:hover": { bgcolor: "#1d4ed8" },
            fontWeight: 600,
            px: 3,
            fontSize: "1.05rem",
            boxShadow: "none",
          }}
          startIcon={<SaveAltIcon />}
          onClick={onSave}
        >
          Save Invoice
        </Button>
      </Stack>
    </Paper>
  </Box>
);

export default InvoiceGeneratorCard;