"use client";
import { Paper, TextField, Typography, Box } from "@mui/material";
import { Company } from "../../types/invoice";

interface Props {
  company: Company;
  onChange: (company: Company) => void;
}

const CompanyInfoForm: React.FC<Props> = ({ company, onChange }) => {
  return (
    <Box
      sx={{
       
        width: "98vw",
        display: "flex",
        justifyContent: "center",
        bgcolor: "#f7f8fa", // subtle gray background
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
        <Box sx={{ display: "flex", alignItems: "center"}}>
          <svg
            style={{
              minWidth: "28px",
              minHeight: "28px",
              maxWidth: "28px",
              maxHeight: "28px",
              marginRight: "10px",
              color: "#2563eb",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-6 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6"
            />
          </svg>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Company Information
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Company Name */}
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Company Name <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              value={company.Name}
              onChange={(e) => onChange({ ...company, Name: e.target.value })}
              placeholder="Enter company name"
              required
              fullWidth
            
            />
          </Box>
          {/* Email */}
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Email <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              variant="standard"
              type="email"
              value={company.Email}
              onChange={(e) => onChange({ ...company, Email: e.target.value })}
              placeholder="company@example.com"
              required
              fullWidth
             
            />
          </Box>
          {/* Phone */}
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Phone
            </Typography>
            <TextField
              variant="standard"
              type="tel"
              value={company.Phone}
              onChange={(e) => onChange({ ...company, Phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              fullWidth
              
            />
          </Box>
          {/* Address */}
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
              Address
            </Typography>
            <TextField
              variant="standard"
              value={company.Adress}
              onChange={(e) => onChange({ ...company, Adress: e.target.value })}
              placeholder="Enter company address"
              multiline
              minRows={2}
              fullWidth
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CompanyInfoForm;