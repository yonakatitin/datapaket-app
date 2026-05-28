import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Container, Typography, Stepper, Step, StepLabel,
  TextField, Button, Grid, Divider, Chip, Alert, CircularProgress,
  Radio, RadioGroup, FormControlLabel, Paper, Collapse, Zoom,
  StepConnector, stepConnectorClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';
const BG = '#F0F2F9';

// ─── Custom Stepper Connector ───────────────────────────────────────────────
const ColorConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 20 },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundImage: `linear-gradient(90deg, ${ACCENT}, #ff5252)` },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundImage: `linear-gradient(90deg, ${ACCENT}, #ff5252)` },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3, border: 0, backgroundColor: '#e0e0e0', borderRadius: 2,
  },
}));

const ColorStepIcon = styled('div')(({ ownerState }) => ({
  width: 42, height: 42, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 800, fontSize: '0.95rem',
  transition: 'all 0.3s',
  ...(ownerState.completed && {
    background: `linear-gradient(135deg, ${ACCENT}, #ff5252)`,
    color: '#fff', boxShadow: `0 4px 14px ${ACCENT}50`,
  }),
  ...(ownerState.active && {
    background: `linear-gradient(135deg, ${ACCENT}, #ff5252)`,
    color: '#fff', boxShadow: `0 4px 14px ${ACCENT}50`,
    transform: 'scale(1.1)',
  }),
  ...(!ownerState.active && !ownerState.completed && {
    background: '#e8eaf0', color: '#999',
  }),
}));

function StepIcon({ active, completed, icon }) {
  return (
    <ColorStepIcon ownerState={{ active, completed }}>
      {completed ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : icon}
    </ColorStepIcon>
  );
}

// ─── Payment Methods ─────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'gopay',    label: 'GoPay',         icon: <AccountBalanceWalletIcon />, color: '#00AED6' },
  { id: 'ovo',      label: 'OVO',            icon: <AccountBalanceWalletIcon />, color: '#4C3494' },
  { id: 'dana',     label: 'DANA',           icon: <AccountBalanceWalletIcon />, color: '#118EEA' },
  { id: 'bca',      label: 'Transfer BCA',   icon: <AccountBalanceIcon />,       color: '#003D82' },
  { id: 'mandiri',  label: 'Transfer Mandiri',icon: <AccountBalanceIcon />,      color: '#003087' },
  { id: 'qris',     label: 'QRIS',           icon: <QrCodeIcon />,               color: '#E53935' },
  { id: 'cc',       label: 'Kartu Kredit',   icon: <CreditCardIcon />,           color: '#555' },
];

// ─── Step 1: Detail Nomor ────────────────────────────────────────────────────
function StepDetail({ pkg, phone, setPhone, onNext }) {
  const { user, updateActivePackage } = useAuth();
  const [err, setErr] = useState('');

  const handleNext = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10 || clean.length > 13) { setErr('Masukkan nomor HP yang valid (10–13 digit)'); return; }
    setErr('');
    onNext();
  };

  return (
    <Box>
      {/* Package summary card */}
      <Box sx={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #2d4259 100%)`,
        borderRadius: '20px', p: 2.5, mb: 3,
      }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5 }}>
          {pkg.provider}
        </Typography>
        <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', mb: 1.5 }}>{pkg.name}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,255,255,0.12)', px: 1.5, py: 0.6, borderRadius: '8px' }}>
            <WifiIcon sx={{ fontSize: 14, color: '#FFD600' }} />
            <Typography sx={{ color: '#FFD600', fontWeight: 900, fontSize: '0.9rem' }}>{pkg.quota}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,255,255,0.12)', px: 1.5, py: 0.6, borderRadius: '8px' }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', fontWeight: 700 }}>{pkg.validity}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Phone number input */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, color: NAVY, mb: 0.5, fontSize: '0.95rem' }}>
          Nomor HP Tujuan
        </Typography>
        <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 1.5 }}>
          Paket data akan diaktifkan ke nomor ini
        </Typography>
        <TextField
          fullWidth
          placeholder="Contoh: 0812-3456-7890"
          value={phone}
          onChange={e => { setPhone(e.target.value); setErr(''); }}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <PhoneAndroidIcon sx={{ color: ACCENT, fontSize: 20 }} />
              </Box>
            ),
          }}
          error={!!err}
          helperText={err}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px', fontWeight: 600, fontSize: '1rem',
              '& fieldset': { borderColor: '#e0e3ec' },
              '&:hover fieldset': { borderColor: ACCENT },
              '&.Mui-focused fieldset': { borderColor: ACCENT },
            }
          }}
        />
        {user && (
          <Button size="small" onClick={() => setPhone(user.phone)}
            sx={{ mt: 1, color: ACCENT, fontWeight: 700, textTransform: 'none', fontSize: '0.8rem', p: 0 }}>
            Gunakan nomor saya: {user.phone}
          </Button>
        )}
      </Box>

      {/* Description */}
      <Box sx={{ bgcolor: '#f8f9fc', borderRadius: '14px', p: 2, mb: 3, border: '1px solid #e8eaf0' }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6 }}>
          {pkg.description}
        </Typography>
      </Box>

      <Button fullWidth variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />}
        sx={{
          bgcolor: ACCENT, borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem', py: 1.4,
          textTransform: 'none', boxShadow: `0 6px 20px ${ACCENT}40`,
          '&:hover': { bgcolor: '#c62828', transform: 'translateY(-1px)' }, transition: 'all 0.2s'
        }}>
        Lanjut ke Pembayaran
      </Button>
    </Box>
  );
}

// ─── Step 2: Pilih Pembayaran ────────────────────────────────────────────────
function StepPayment({ pkg, phone, payMethod, setPayMethod, onNext, onBack }) {
  return (
    <Box>
      {/* Order summary mini */}
      <Box sx={{
        bgcolor: '#f8f9fc', borderRadius: '14px', p: 2, mb: 3,
        border: '1px solid #e8eaf0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.9rem' }}>{pkg.name}</Typography>
          <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>{phone}</Typography>
        </Box>
        <Typography sx={{ fontWeight: 900, color: ACCENT, fontSize: '1.1rem' }}>
          Rp {pkg.price.toLocaleString('id-ID')}
        </Typography>
      </Box>

      <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1.5, fontSize: '0.95rem' }}>
        Metode Pembayaran
      </Typography>

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {PAYMENT_METHODS.map(m => (
          <Grid item xs={6} sm={4} key={m.id}>
            <Box
              onClick={() => setPayMethod(m.id)}
              sx={{
                border: '2px solid',
                borderColor: payMethod === m.id ? ACCENT : '#e0e3ec',
                borderRadius: '14px', p: 1.5,
                cursor: 'pointer', textAlign: 'center',
                bgcolor: payMethod === m.id ? `${ACCENT}08` : '#fff',
                transition: 'all 0.2s',
                '&:hover': { borderColor: `${ACCENT}80`, bgcolor: `${ACCENT}05` }
              }}
            >
              <Box sx={{ color: payMethod === m.id ? m.color : '#aaa', mb: 0.5, transition: 'color 0.2s' }}>
                {m.icon}
              </Box>
              <Typography sx={{
                fontSize: '0.72rem', fontWeight: 700,
                color: payMethod === m.id ? NAVY : '#888',
              }}>{m.label}</Typography>
              {payMethod === m.id && (
                <CheckCircleIcon sx={{ fontSize: 14, color: ACCENT, mt: 0.3 }} />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Total box */}
      <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: `2px solid ${ACCENT}20`, p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Harga paket</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: NAVY }}>
            Rp {pkg.price.toLocaleString('id-ID')}
          </Typography>
        </Box>
        {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Diskon</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#2E7D32' }}>
              - Rp {(pkg.originalPrice - pkg.price).toLocaleString('id-ID')}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Biaya layanan</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: NAVY }}>Rp 0</Typography>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 800, color: NAVY }}>Total</Typography>
          <Typography sx={{ fontWeight: 900, color: ACCENT, fontSize: '1.1rem' }}>
            Rp {pkg.price.toLocaleString('id-ID')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" onClick={onBack} startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: '14px', fontWeight: 700, textTransform: 'none', borderColor: '#ddd', color: '#666', flex: 1, py: 1.3 }}>
          Kembali
        </Button>
        <Button fullWidth variant="contained" onClick={onNext} disabled={!payMethod}
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: ACCENT, borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem', py: 1.3,
            textTransform: 'none', flex: 2, boxShadow: `0 6px 20px ${ACCENT}40`,
            '&:hover': { bgcolor: '#c62828' }, '&:disabled': { bgcolor: '#e0e0e0' }
          }}>
          Bayar Sekarang
        </Button>
      </Box>
    </Box>
  );
}

// ─── Step 3: Konfirmasi / Sukses ─────────────────────────────────────────────
function StepSuccess({ pkg, phone, payMethod, trxCode }) {
  const navigate = useNavigate();
  const payLabel = PAYMENT_METHODS.find(m => m.id === payMethod)?.label || payMethod;

  return (
    <Zoom in timeout={400}>
      <Box sx={{ textAlign: 'center' }}>
        {/* Success icon */}
        <Box sx={{
          width: 88, height: 88, borderRadius: '50%', mx: 'auto', mb: 2.5,
          background: `linear-gradient(135deg, #43A047, #66BB6A)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(67,160,71,0.4)',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(67,160,71,0.4)' },
            '70%': { boxShadow: '0 0 0 16px rgba(67,160,71,0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(67,160,71,0)' },
          }
        }}>
          <CheckCircleIcon sx={{ color: '#fff', fontSize: 48 }} />
        </Box>

        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: NAVY, mb: 0.5 }}>
          Pembayaran Berhasil!
        </Typography>
        <Typography sx={{ color: '#888', fontSize: '0.88rem', mb: 3 }}>
          Paket data sedang diaktifkan ke nomor tujuan
        </Typography>

        {/* Receipt card */}
        <Box sx={{
          bgcolor: '#fff', borderRadius: '20px', border: '1.5px solid #e8eaf0',
          p: 3, mb: 3, textAlign: 'left',
        }}>
          {/* Decorative top bar */}
          <Box sx={{ background: `linear-gradient(90deg, ${ACCENT}, #ff5252)`, height: 4, borderRadius: '4px 4px 0 0', mx: -3, mt: -3, mb: 2.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ color: '#888', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Kode Transaksi
            </Typography>
            <Chip label={trxCode} size="small"
              sx={{ bgcolor: `${ACCENT}12`, color: ACCENT, fontWeight: 800, fontSize: '0.72rem', fontFamily: 'monospace' }} />
          </Box>

          {[
            { label: 'Paket', value: pkg.name },
            { label: 'Provider', value: pkg.provider },
            { label: 'Kuota', value: pkg.quota },
            { label: 'Masa Aktif', value: pkg.validity },
            { label: 'Nomor Tujuan', value: phone },
            { label: 'Metode Bayar', value: payLabel },
          ].map(({ label, value }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px dashed #f0f0f0' }}>
              <Typography sx={{ color: '#888', fontSize: '0.82rem' }}>{label}</Typography>
              <Typography sx={{ fontWeight: 700, color: NAVY, fontSize: '0.82rem', maxWidth: '55%', textAlign: 'right' }}>{value}</Typography>
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5 }}>
            <Typography sx={{ fontWeight: 800, color: NAVY }}>Total Bayar</Typography>
            <Typography sx={{ fontWeight: 900, color: ACCENT, fontSize: '1.1rem' }}>
              Rp {pkg.price.toLocaleString('id-ID')}
            </Typography>
          </Box>
        </Box>

        {/* CTA Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button fullWidth variant="contained" onClick={() => navigate(`/history?t=${Date.now()}`)}
            startIcon={<ReceiptLongIcon />}
            sx={{
              bgcolor: ACCENT, borderRadius: '14px', fontWeight: 800, py: 1.4,
              textTransform: 'none', boxShadow: `0 6px 20px ${ACCENT}40`,
              '&:hover': { bgcolor: '#c62828' }
            }}>
            Lihat Riwayat Transaksi
          </Button>
          <Button fullWidth variant="outlined" onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{
              borderRadius: '14px', fontWeight: 700, py: 1.3,
              textTransform: 'none', borderColor: '#ddd', color: '#666',
              '&:hover': { borderColor: ACCENT, color: ACCENT, bgcolor: `${ACCENT}05` }
            }}>
            Kembali ke Beranda
          </Button>
        </Box>
      </Box>
    </Zoom>
  );
}

// ─── Main Transaction Page ────────────────────────────────────────────────────
const STEPS = ['Detail', 'Pembayaran', 'Selesai'];

export default function Transaction() {
  const { user, updateActivePackage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pkg = location.state?.pkg;

  const [activeStep, setActiveStep] = useState(0);
  const [phone, setPhone] = useState(user?.phone || '');
  const [payMethod, setPayMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [trxCode, setTrxCode] = useState('');

  // Guard: must be logged in and have a package
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!pkg) { navigate('/'); }
  }, [user, pkg]);

  if (!user || !pkg) return null;

  const handlePay = async () => {
    setLoading(true);
    const code = `TRX-${Date.now().toString().slice(-8)}`;
    const payLabel = PAYMENT_METHODS.find(m => m.id === payMethod)?.label || payMethod;
    const trx = {
      userId: Number(user.id),
      packageId: pkg.id,
      packageName: pkg.name,
      provider: pkg.provider,
      amount: pkg.price,
      phone,
      status: 'success',
      paymentMethod: payLabel,
      date: new Date().toISOString(),
      transactionCode: code,
    };
    try {
      // 1. POST transaction to json-server
      const res = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trx),
      });
      if (!res.ok) throw new Error('POST failed');

      // 2. Update active package in AuthContext + localStorage + json-server
      await updateActivePackage(pkg);

      setTrxCode(code);
      setActiveStep(2);
    } catch (e) {
      // Still update UI even if server fails
      try { await updateActivePackage(pkg); } catch (_) {}
      setTrxCode(code);
      setActiveStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          {activeStep < 2 && (
            <Box onClick={() => activeStep === 0 ? navigate(-1) : setActiveStep(s => s - 1)}
              sx={{
                width: 38, height: 38, borderRadius: '10px', bgcolor: '#fff',
                border: '1.5px solid #e8eaf0', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
                '&:hover': { borderColor: ACCENT, color: ACCENT }
              }}>
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </Box>
          )}
          <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: NAVY }}>
            {activeStep === 2 ? 'Transaksi Selesai' : 'Beli Paket Data'}
          </Typography>
        </Box>

        {/* Stepper */}
        {activeStep < 2 && (
          <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} sx={{ mb: 4 }}>
            {STEPS.slice(0, 2).map((label, i) => (
              <Step key={label}>
                <StepLabel StepIconComponent={StepIcon}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: activeStep === i ? ACCENT : '#999' }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Step content */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '24px', p: { xs: 2.5, sm: 3 }, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {activeStep === 0 && (
            <StepDetail pkg={pkg} phone={phone} setPhone={setPhone} onNext={() => setActiveStep(1)} />
          )}
          {activeStep === 1 && (
            loading
              ? <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress sx={{ color: ACCENT }} size={48} />
                  <Typography sx={{ color: '#888', fontWeight: 600 }}>Memproses pembayaran...</Typography>
                </Box>
              : <StepPayment pkg={pkg} phone={phone} payMethod={payMethod} setPayMethod={setPayMethod}
                  onNext={handlePay} onBack={() => setActiveStep(0)} />
          )}
          {activeStep === 2 && (
            <StepSuccess pkg={pkg} phone={phone} payMethod={payMethod} trxCode={trxCode} />
          )}
        </Box>
      </Container>
    </Box>
  );
}
