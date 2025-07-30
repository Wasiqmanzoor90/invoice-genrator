"use client";
import React from "react";
import { Client } from "../../types/invoice";
import { Box,  Paper, TextField, Typography } from "@mui/material";

interface Props {
  client: Client;
  onChange: (client: Client) => void;
}
const ClientinfoForm: React.FC<Props> = ({ client, onChange }) => {
  return (
    <Box
      sx={{
        width: "98vw",
        display: "flex",
        justifyContent: "center",
        borderRadius: 3,
     
        bgcolor: "#f7f8fa", // subtle gray background
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" className="mb-4 flex items-center">
            <svg
              style={{
                minWidth: "28px",
                minHeight: "28px",
                maxWidth: "28px",
                maxHeight: "28px",
                marginRight: "10px",
                color: "green",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Client Information
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Client Name <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              value={client.Name}
              onChange={(e) => onChange({ ...client, Name: e.target.value })}
              placeholder="Enter client name"
              required
              fullWidth
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Email<span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              type="email"
              value={client.Email}
              onChange={(e) => onChange({ ...client, Email: e.target.value })}
              placeholder="Enter client Email"
              required
              fullWidth
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Address<span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              value={client.Address}
              onChange={(e) => onChange({ ...client, Address: e.target.value })}
              placeholder="Enter client phone Address"
              fullWidth
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientinfoForm;
