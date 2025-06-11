'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { signIn } from 'next-auth/react'; 

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "info" | "success" | "error" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const formData = { name, email, password };
  const router = useRouter();

  const handleregister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ open: false, message: "", severity: "info" });

    try {
      const url = "/api/user/register";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setAlert({ open: true, message: "Registration successful! Redirecting...", severity: "success" });
        setTimeout(() => {
          router.push("/invoice/main");
        }, 1200);
      } else {
        setAlert({ open: true, message: data.message || "Registration failed.", severity: "error" });
      }
    } catch (error) {
      setAlert({ open: true, message: "Error during registration. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={handleregister}
        sx={{
          width: { xs: '100%', sm: 400 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
          border: '1px solid #e0e0e0',
          gap: 1.5,
        }}
      >
        <Fade in timeout={600}>
          <Box sx={{ width: '100%' }}>
            <Typography variant='h4' fontWeight={700} color="primary.main" gutterBottom>
              Create Account
            </Typography>
            <Typography variant='subtitle1' color="text.secondary" gutterBottom>
              Start your journey in your professional world
            </Typography>
          </Box>
        </Fade>

        {alert.open &&
          <Alert severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        }

        <TextField
          variant="outlined"
          margin="dense"
          fullWidth
          name="username"
          label="Username"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          required
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          variant="outlined"
          margin="dense"
          fullWidth
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          variant="outlined"
          margin="dense"
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            sx: { borderRadius: 2 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          type='submit'
          variant='contained'
          sx={{
            mt: 1,
            borderRadius: 2,
            height: 46,
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: 0.5,
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.09)'
          }}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Sign up'}
        </Button>


        <Button
                onClick={()=>signIn("github")}
                    variant="outlined"
                    fullWidth
                    startIcon={<FontAwesomeIcon icon={faGithub} style={{ color: 'black', fontSize: '26px' }} />}
                    sx={{
                        color: 'black',
                        borderColor: 'black',
                        borderRadius: 2,
                        height: 46,
                        fontWeight: 600,
                        textTransform: 'none',
                        mb: 1,
                        '&:hover': {
                            borderColor: '#333',
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                >
                    Sign in with GitHub
                </Button>


        <Typography variant='body2' color="text.secondary" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href='/user/login' style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </Typography>

       
      </Box>
    </Container>
  );
}

export default Register;