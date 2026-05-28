import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Container, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Divider, CircularProgress, Chip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WifiIcon from '@mui/icons-material/Wifi';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPkg = location.state?.redirectPkg;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Email dan password harus diisi.'); return; }
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      if (redirectPkg) navigate('/transaction', { state: { pkg: redirectPkg } });
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'budi@example.com', password: 'password123' });

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, ${NAVY} 0%, #2d4259 40%, #1a3a5c 70%, #0d2137 100%)`,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative bg */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', bgcolor: `${ACCENT}15`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -120, left: -80, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '40%', left: '60%', width: 200, height: 200, borderRadius: '50%', bgcolor: `${ACCENT}08`, pointerEvents: 'none' }} />

      {/* Back button */}
      <Box sx={{ p: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' } }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth="xs" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pb: 4, position: 'relative' }}>
        {/* Logo & Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '18px',
            background: `linear-gradient(135deg, ${ACCENT}, #ff6b6b)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
            boxShadow: `0 8px 24px ${ACCENT}50`,
          }}>
            <SignalCellularAltIcon sx={{ color: '#fff', fontSize: 34 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#fff', letterSpacing: '-0.5px' }}>
            DataPaket
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', mt: 0.5 }}>
            Masuk untuk melanjutkan pembelian
          </Typography>
        </Box>

        {/* Redirect context box */}
        {redirectPkg && (
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '14px', p: 2, mb: 3,
          }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Paket yang dipilih
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{redirectPkg.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WifiIcon sx={{ fontSize: 12, color: '#FFD600' }} />
                  <Typography sx={{ color: '#FFD600', fontSize: '0.8rem', fontWeight: 700 }}>{redirectPkg.quota}</Typography>
                </Box>
              </Box>
              <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>
                Rp {redirectPkg.price.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Form card */}
        <Box sx={{
          bgcolor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px', p: 3.5,
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', mb: 0.5 }}>Masuk</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', mb: 3 }}>
            Gunakan akun DataPaket kamu
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', bgcolor: `${ACCENT}20`, color: '#ff8a80', border: `1px solid ${ACCENT}40`, '& .MuiAlert-icon': { color: ACCENT } }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="email" type="email" placeholder="Alamat email"
              value={form.email} onChange={handleChange}
              fullWidth autoComplete="email"
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} /></InputAdornment>
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: ACCENT },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                },
              }}
            />
            <TextField
              name="password" type={showPass ? 'text' : 'password'} placeholder="Password"
              value={form.password} onChange={handleChange}
              fullWidth autoComplete="current-password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(s => !s)} sx={{ color: 'rgba(255,255,255,0.4)', p: 0.5 }}>
                      {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '14px', color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: ACCENT },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                },
              }}
            />

            <Button
              type="submit" fullWidth disabled={loading}
              variant="contained"
              sx={{
                bgcolor: ACCENT, borderRadius: '14px', fontWeight: 800,
                fontSize: '0.95rem', py: 1.4, mt: 0.5,
                boxShadow: `0 6px 20px ${ACCENT}50`,
                textTransform: 'none',
                '&:hover': { bgcolor: '#c62828', boxShadow: `0 8px 24px ${ACCENT}60`, transform: 'translateY(-1px)' },
                '&:disabled': { bgcolor: `${ACCENT}60` },
                transition: 'all 0.2s',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Masuk Sekarang'}
            </Button>
          </Box>

          <Divider sx={{ my: 2.5, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.15)' } }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', px: 1 }}>atau coba demo</Typography>
          </Divider>

          <Button
            fullWidth variant="outlined" onClick={fillDemo}
            sx={{
              borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
              borderRadius: '14px', fontWeight: 700, py: 1.1, textTransform: 'none',
              '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
          >
            Isi Akun Demo
          </Button>
        </Box>

        <Typography sx={{ textAlign: 'center', mt: 2.5, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
          Demo: budi@example.com / password123
        </Typography>
      </Container>
    </Box>
  );
}
