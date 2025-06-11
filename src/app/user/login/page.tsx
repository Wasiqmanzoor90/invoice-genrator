"use client";

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, TextField, Typography, InputAdornment, IconButton, CircularProgress, Alert } from '@mui/material'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import React from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signIn } from "next-auth/react";

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const url = "/api/user/login";
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("name", data.user.username);
                localStorage.setItem("email", data.user.email);
                setSuccess(true);
                setTimeout(() => {
                    router.push("/invoice/main");
                }, 1200);
            } else {
                setError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Error during login. Please try again.");
        }
        setLoading(false);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Container maxWidth="sm" sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    width: { xs: '100%', sm: 400 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                    border: '1px solid #e0e0e0',
                    gap: 1.5,
                }}
            >
                <Typography variant='h4' fontWeight={700} color="primary.main" gutterBottom>
                    Welcome Back
                </Typography>
                <Typography variant='subtitle1' color="text.secondary" gutterBottom align="center">
                    Sign in to continue to your dashboard
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ width: '100%' }}>Login successful! Redirecting...</Alert>}

                <TextField
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    label="Email or Phone"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    InputProps={{
                        sx: { borderRadius: 2 },
                    }}
                />
                <TextField
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    InputProps={{
                        sx: { borderRadius: 2 },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
                    <Link href="#" style={{ fontSize: '0.95rem', color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
                        Forgot Password?
                    </Link>
                </Box>

                <Button
                    variant='contained'
                    color="primary"
                    type="submit"
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
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>

                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', my: 1 }}>
                    <Box sx={{ flex: 1, height: 1, bgcolor: 'grey.300', borderRadius: 1 }} />
                    <Typography sx={{ mx: 2, color: 'grey.500', fontSize: '0.95rem' }}>or</Typography>
                    <Box sx={{ flex: 1, height: 1, bgcolor: 'grey.300', borderRadius: 1 }} />
                </Box>

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

                <Typography variant='body2' color="text.secondary" sx={{ mt: 1 }}>
                    Don't have an account?
                    <Link href='/user/register' style={{ color: '#1976d2', textDecoration: 'none', marginLeft: 4, fontWeight: 500 }}>
                        Register here
                    </Link>
                </Typography>
            </Box>
        </Container>
    )
}

export default Login;