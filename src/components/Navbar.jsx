import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, Chip,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Divider, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WifiIcon from '@mui/icons-material/Wifi';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const navItems = [
    { label: 'Beranda', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Riwayat', path: '/history', icon: <ReceiptLongIcon fontSize="small" /> },
    ...(user ? [{ label: 'Akun Saya', path: '/customer', icon: <PersonIcon fontSize="small" /> }] : []),
  ];

  const drawerContent = (
    <Box sx={{ width: 270, pt: 1 }}>
      {/* Drawer header */}
      <Box sx={{ px: 3, py: 2.5, background: `linear-gradient(135deg, ${NAVY} 0%, #2d4259 100%)` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: `linear-gradient(135deg, ${ACCENT}, #ff6b6b)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <SignalCellularAltIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
            DataPaket
          </Typography>
        </Box>
      </Box>

      {user && (
        <Box sx={{ px: 3, py: 2, bgcolor: '#f8f9fc', borderBottom: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: ACCENT, width: 38, height: 38, fontSize: '0.9rem', fontWeight: 700 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: NAVY }}>{user.name}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#888' }}>{user.phone}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ px: 1.5, pt: 1.5 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => { navigate(item.path); setDrawerOpen(false); }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '10px',
                py: 1.2,
                '&.Mui-selected': {
                  bgcolor: `${ACCENT}15`,
                  color: ACCENT,
                  '& .MuiListItemText-primary': { color: ACCENT, fontWeight: 700 },
                },
                '&:hover': { bgcolor: `${ACCENT}0d` }
              }}
            >
              <Box sx={{ mr: 1.5, color: location.pathname === item.path ? ACCENT : '#888' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {user ? (
        <>
          <Divider sx={{ mx: 2, my: 1 }} />
          <List sx={{ px: 1.5 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: '10px', py: 1.2, color: ACCENT, '&:hover': { bgcolor: `${ACCENT}0d` } }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <ListItemText primary="Keluar" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600, color: ACCENT }} />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      ) : (
        <Box sx={{ px: 2, pb: 2 }}>
          <Button fullWidth variant="contained" onClick={() => { navigate('/login'); setDrawerOpen(false); }}
            sx={{ bgcolor: ACCENT, borderRadius: '12px', fontWeight: 700, py: 1.2, '&:hover': { bgcolor: '#c62828' } }}>
            Masuk / Daftar
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        zIndex: 1200,
      }}>
        <Toolbar sx={{ minHeight: { xs: 60, md: 68 }, px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', mr: 4 }}
          >
            <Box sx={{
              width: 34, height: 34, borderRadius: '10px',
              background: `linear-gradient(135deg, ${ACCENT}, #ff6b6b)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${ACCENT}40`
            }}>
              <SignalCellularAltIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{
              fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px',
              background: `linear-gradient(135deg, ${NAVY}, #2d4259)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              DataPaket
            </Typography>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? ACCENT : '#555',
                    fontWeight: location.pathname === item.path ? 700 : 600,
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    px: 1.8,
                    py: 0.8,
                    bgcolor: location.pathname === item.path ? `${ACCENT}12` : 'transparent',
                    '&:hover': { bgcolor: `${ACCENT}0d`, color: ACCENT },
                    textTransform: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flex: isMobile ? 1 : 'none' }} />

          {/* Right side */}
          {!isMobile && (
            user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: ACCENT, color: '#fff !important', fontWeight: 700, fontSize: '0.75rem !important' }}>{user.name.charAt(0)}</Avatar>}
                  label={user.name.split(' ')[0]}
                  variant="outlined"
                  onClick={() => navigate('/customer')}
                  sx={{ borderColor: '#e0e0e0', fontWeight: 600, fontSize: '0.82rem', color: NAVY, cursor: 'pointer', '&:hover': { borderColor: ACCENT, bgcolor: `${ACCENT}08`, color: ACCENT }, transition: 'all 0.2s' }}
                />
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon fontSize="small" />}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: ACCENT, borderColor: `${ACCENT}50`, borderRadius: '10px',
                    fontWeight: 700, fontSize: '0.8rem', textTransform: 'none',
                    '&:hover': { borderColor: ACCENT, bgcolor: `${ACCENT}08` }
                  }}
                >
                  Keluar
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: ACCENT, borderRadius: '24px', fontWeight: 700,
                    fontSize: '0.85rem', px: 2.5, py: 0.8, textTransform: 'none',
                    boxShadow: `0 4px 14px ${ACCENT}40`,
                    '&:hover': { bgcolor: '#c62828', boxShadow: `0 6px 18px ${ACCENT}50` }
                  }}
                >
                  Masuk
                </Button>
              </Box>
            )
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: NAVY }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px 0 0 16px' } }}>
        {drawerContent}
      </Drawer>
    </>
  );
}
