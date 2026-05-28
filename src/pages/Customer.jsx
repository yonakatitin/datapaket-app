import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Container, Typography, Button, Avatar, Chip,
  LinearProgress, Divider, CircularProgress, Alert
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import LockIcon from '@mui/icons-material/Lock';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import AddIcon from '@mui/icons-material/Add';
import StorageIcon from '@mui/icons-material/Storage';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';
const BG = '#F0F2F9';

function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.3, borderBottom: '1px solid #f0f2f9' }}>
      <Box sx={{ color: '#bbb' }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</Typography>
        <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.9rem' }}>{value}</Typography>
      </Box>
    </Box>
  );
}

export default function Customer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [loadingTrx, setLoadingTrx] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/transactions?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
        setTransactions(sorted);
        setLoadingTrx(false);
      })
      .catch(() => setLoadingTrx(false));
  }, [user, location.key]);

  if (!user) {
    return (
      <Box sx={{ bgcolor: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockIcon sx={{ color: ACCENT, fontSize: 36 }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: NAVY, mb: 0.5 }}>Login Diperlukan</Typography>
        <Typography sx={{ color: '#888', fontSize: '0.88rem', textAlign: 'center', mb: 3 }}>
          Masuk untuk melihat informasi akun dan paket aktif kamu
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}
          sx={{ bgcolor: ACCENT, borderRadius: '14px', fontWeight: 800, textTransform: 'none', px: 4, py: 1.3, boxShadow: `0 6px 20px ${ACCENT}40` }}>
          Masuk Sekarang
        </Button>
      </Box>
    );
  }

  const pkg = user.activePackage;
  const usagePercent = pkg
    ? Math.min(100, Math.round((parseFloat(pkg.remaining) / parseFloat(pkg.quota)) * 100))
    : 0;
  const expiry = pkg ? new Date(pkg.expiry) : null;
  const daysLeft = expiry
    ? Math.max(0, Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const usageColor = usagePercent < 20 ? '#E53935' : usagePercent < 50 ? '#FF8F00' : '#2E7D32';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: '100vh', pb: 8 }}>
      {/* Profile Header */}
      <Box sx={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #2d4259 60%, #1a3a5c 100%)`,
        pt: 4, pb: 7, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(229,57,53,0.12)' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar sx={{
              width: 70, height: 70, fontSize: '1.8rem', fontWeight: 900,
              background: `linear-gradient(135deg, ${ACCENT}, #ff6b6b)`,
              boxShadow: `0 6px 20px ${ACCENT}50`,
              border: '3px solid rgba(255,255,255,0.2)'
            }}>
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-0.3px' }}>
                {user.name}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', mb: 0.8 }}>
                {user.provider || 'IM3 Ooredoo'}
              </Typography>
              <Chip
                label={pkg ? 'Paket Aktif' : 'Tidak Ada Paket'}
                size="small"
                icon={pkg ? <CheckCircleIcon sx={{ fontSize: '14px !important', color: '#69F0AE !important' }} /> : <WifiOffIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  bgcolor: pkg ? 'rgba(105,240,174,0.2)' : 'rgba(255,255,255,0.1)',
                  color: pkg ? '#69F0AE' : 'rgba(255,255,255,0.5)',
                  fontWeight: 700, fontSize: '0.7rem', height: 24,
                  border: `1px solid ${pkg ? 'rgba(105,240,174,0.3)' : 'rgba(255,255,255,0.15)'}`,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ mt: -4 }}>

        {/* ── Active Package Card ── */}
        {pkg ? (
          <Box sx={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, #ff5252 60%, #ff1744 100%)`,
            borderRadius: '24px', p: 3, mb: 2.5,
            boxShadow: `0 8px 32px ${ACCENT}40`,
            position: 'relative', overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, position: 'relative' }}>
              <Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', mb: 0.4 }}>
                  Paket Aktif
                </Typography>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem', lineHeight: 1.3 }}>
                  {pkg.name}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '10px', px: 1.5, py: 0.6, textAlign: 'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', lineHeight: 1 }}>{daysLeft}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', fontWeight: 700 }}>HARI LAGI</Typography>
              </Box>
            </Box>

            {/* Usage bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StorageIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 700 }}>
                    Sisa: <strong style={{ color: '#fff' }}>{pkg.remaining}</strong> dari {pkg.quota}
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {usagePercent}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={usagePercent}
                sx={{
                  height: 8, borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: usagePercent < 20 ? '#FFD600' : '#fff',
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Expiry info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 2 }}>
              <CalendarMonthIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>
                Berakhir {expiry?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Typography>
            </Box>

            {/* Low quota warning */}
            {usagePercent < 20 && (
              <Alert severity="warning" icon={false}
                sx={{
                  bgcolor: 'rgba(255,255,0,0.15)', color: '#FFD600',
                  borderRadius: '10px', py: 0.5, mb: 2,
                  fontSize: '0.78rem', fontWeight: 700,
                  border: '1px solid rgba(255,215,0,0.3)',
                }}>
                ⚠️ Kuota hampir habis! Segera perpanjang paket.
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={() => navigate('/')}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#fff', color: ACCENT, borderRadius: '12px', fontWeight: 800,
                textTransform: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-1px)' },
                transition: 'all 0.2s'
              }}
            >
              Beli / Perpanjang Paket
            </Button>
          </Box>
        ) : (
          <Box sx={{
            bgcolor: '#fff', borderRadius: '24px', p: 3, mb: 2.5,
            border: '2px dashed #e0e3ec', textAlign: 'center',
          }}>
            <WifiOffIcon sx={{ fontSize: 48, color: '#ddd', mb: 1.5 }} />
            <Typography sx={{ fontWeight: 800, color: NAVY, mb: 0.5 }}>Tidak ada paket aktif</Typography>
            <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 2 }}>Beli paket data sekarang dan nikmati internet tanpa batas</Typography>
            <Button variant="contained" onClick={() => navigate('/')} startIcon={<ShoppingCartIcon />}
              sx={{ bgcolor: ACCENT, borderRadius: '12px', fontWeight: 800, textTransform: 'none', boxShadow: `0 6px 20px ${ACCENT}40` }}>
              Beli Paket Sekarang
            </Button>
          </Box>
        )}

        {/* ── Account Info ── */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: 2.5, mb: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.95rem', mb: 1.5 }}>
            Informasi Akun
          </Typography>
          <InfoRow icon={<PhoneAndroidIcon sx={{ fontSize: 18 }} />} label="Nomor HP" value={user.phone} />
          <InfoRow icon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />} label="Email" value={user.email} />
          <InfoRow icon={<WifiIcon sx={{ fontSize: 18 }} />} label="Provider" value={user.provider || 'IM3 Ooredoo'} />
        </Box>

        {/* ── Recent Transactions ── */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: 2.5, mb: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.95rem' }}>
              Transaksi Terakhir
            </Typography>
            <Button size="small" onClick={() => navigate('/history')}
              sx={{ color: ACCENT, fontWeight: 700, textTransform: 'none', fontSize: '0.78rem', p: 0 }}>
              Lihat Semua
            </Button>
          </Box>

          {loadingTrx ? (
            <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} sx={{ color: ACCENT }} />
            </Box>
          ) : transactions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <ReceiptLongIcon sx={{ fontSize: 36, color: '#ddd', mb: 1 }} />
              <Typography sx={{ color: '#bbb', fontSize: '0.82rem' }}>Belum ada transaksi</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {transactions.map(trx => (
                <Box key={trx.id} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  py: 1.2, borderBottom: '1px solid #f5f5f5',
                  '&:last-child': { borderBottom: 'none' }
                }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.85rem' }}>{trx.packageName}</Typography>
                    <Typography sx={{ color: '#aaa', fontSize: '0.72rem' }}>
                      {new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.88rem' }}>
                      Rp {trx.amount.toLocaleString('id-ID')}
                    </Typography>
                    <Chip
                      label={trx.status === 'success' ? 'Berhasil' : trx.status === 'pending' ? 'Menunggu' : 'Gagal'}
                      size="small"
                      icon={trx.status === 'success' ? <CheckCircleIcon sx={{ fontSize: '11px !important' }} /> : <PendingIcon sx={{ fontSize: '11px !important' }} />}
                      sx={{
                        height: 18, fontSize: '0.62rem', fontWeight: 700,
                        bgcolor: trx.status === 'success' ? '#E8F5E9' : trx.status === 'pending' ? '#FFF3E0' : '#FFEBEE',
                        color: trx.status === 'success' ? '#2E7D32' : trx.status === 'pending' ? '#E65100' : '#C62828',
                        '& .MuiChip-icon': { color: 'inherit' },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ── Logout Button ── */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: `${ACCENT}40`, color: ACCENT,
            borderRadius: '16px', fontWeight: 800, py: 1.5,
            fontSize: '0.95rem', textTransform: 'none',
            '&:hover': {
              borderColor: ACCENT, bgcolor: `${ACCENT}08`,
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 14px ${ACCENT}20`
            },
            transition: 'all 0.2s'
          }}
        >
          Keluar dari Akun
        </Button>
        <Typography sx={{ textAlign: 'center', color: '#ccc', fontSize: '0.72rem', mt: 1.5 }}>
          DataPaket v1.0 · by IM3 Ooredoo
        </Typography>
      </Container>
    </Box>
  );
}
