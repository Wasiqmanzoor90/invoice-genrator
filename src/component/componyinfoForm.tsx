import { Grid, Paper, TextField, Typography } from "@mui/material";
import { Company } from "../../types/invoice";

interface Props {
  company: Company;
  onChange: (company: Company) => void;
}

const companyinfoForm: React.FC<Props> = ({ company, onChange }) => {
  return (
    <Paper>
      <Typography>Company Information Form</Typography>
      <Grid container spacing={2}>
        <Grid>
          <TextField
            label="Company Name"
            value={company.Name}
            onChange={(e) => onChange({ ...company, Name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid>

          <TextField
            label="Phone"
            value={company.Phone}
            onChange={(e) => onChange({ ...company, Phone: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid>
          <TextField
            label="Email"
            value={company.Email}
            onChange={(e) => onChange({ ...company, Email: e.target.value })}
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default companyinfoForm;
