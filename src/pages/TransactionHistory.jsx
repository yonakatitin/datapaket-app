import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Container, Typography, Chip, Skeleton,
  Alert, Button, TextField, InputAdornment,
  Select, MenuItem, FormControl, Collapse, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';
const BG = '#F0F2F9';

const STATUS_CONFIG = {
  success: { label: 'Berhasil', color: '#2E7D32', bg: '#E8F5E9', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  pending: { label: 'Menunggu', color: '#E65100', bg: '#FFF3E0', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
  failed:  { label: 'Gagal',    color: '#C62828', bg: '#FFEBEE', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
};

function TransactionCard({ trx }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[trx.status] || STATUS_CONFIG.success;
  const date = new Date(trx.date);
  const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{
      bgcolor: '#fff', borderRadius: '18px',
      border: '1.5px solid #e8eaf0', overflow: 'hidden',
      transition: 'all 0.2s',
      '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderColor: '#d0d4e0' }
    }}>
      <Box sx={{ height: 4, bgcolor: status.color, opacity: 0.8 }} />
      <Box sx={{ p: 2.2 }}>
        {/* Top row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '0.95rem', lineHeight: 1.3, mb: 0.3 }}>
              {trx.packageName}
            </Typography>
            <Typography sx={{ color: '#999', fontSize: '0.72rem', fontWeight: 600 }}>
              {trx.provider}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: '1rem' }}>
              Rp {Number(trx.amount).toLocaleString('id-ID')}
            </Typography>
            <Chip
              label={status.label} size="small" icon={status.icon}
              sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: '0.65rem', height: 22, mt: 0.4, '& .MuiChip-icon': { color: status.color } }}
            />
          </Box>
        </Box>

        {/* Info row */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 12, color: '#aaa' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{dateStr}, {timeStr}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PaymentIcon sx={{ fontSize: 12, color: '#aaa' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{trx.paymentMethod}</Typography>
          </Box>
        </Box>

        {/* Expand */}
        <Box onClick={() => setExpanded(s => !s)}
          sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#aaa', '&:hover': { color: ACCENT } }}>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>
            {expanded ? 'Sembunyikan detail' : 'Lihat detail transaksi'}
          </Typography>
          {expanded ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 1.5, bgcolor: '#f8f9fc', borderRadius: '12px', p: 2, border: '1px solid #eee' }}>
            {[
              { label: 'Nomor Tujuan',    value: trx.phone },
              { label: 'Kode Transaksi',  value: trx.transactionCode, mono: true },
              { label: 'Status',          value: status.label, chip: true },
            ].map(({ label, value, mono, chip }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography sx={{ color: '#999', fontSize: '0.78rem' }}>{label}</Typography>
                {chip
                  ? <Chip label={value} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                  : <Typography sx={{ fontWeight: 700, color: mono ? ACCENT : NAVY, fontSize: '0.78rem', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</Typography>
                }
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

export default function TransactionHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Satu useEffect langsung — tidak pakai useCallback agar selalu re-run
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`http://localhost:3001/transactions?userId=${user.id}`)
      .then(res => { if (!res.ok) throw new Error('Network error'); return res.json(); })
      .then(data => {
        if (cancelled) return;
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sorted);
      })
      .catch(() => {
        if (!cancelled) setError('Gagal memuat riwayat transaksi. Pastikan json-server berjalan di port 3001.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, location.key, searchParams.get('t'), refreshKey]);

  const fetchTransactions = () => setRefreshKey(k => k + 1);

  if (!user) {
    return (
      <Box sx={{ bgcolor: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockIcon sx={{ color: ACCENT, fontSize: 36 }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: NAVY, mb: 0.5 }}>Login Diperlukan</Typography>
        <Typography sx={{ color: '#888', fontSize: '0.88rem', textAlign: 'center', mb: 3 }}>
          Masuk untuk melihat riwayat transaksi kamu
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}
          sx={{ bgcolor: ACCENT, borderRadius: '14px', fontWeight: 800, textTransform: 'none', px: 4, py: 1.3, boxShadow: `0 6px 20px ${ACCENT}40` }}>
          Masuk Sekarang
        </Button>
      </Box>
    );
  }

  const filtered = transactions.filter(t => {
    const matchSearch = t.packageName.toLowerCase().includes(search.toLowerCase()) ||
      (t.transactionCode || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalSpent = transactions
    .filter(t => t.status === 'success')
    .reduce((s, t) => s + Number(t.amount), 0);

  return (
    <Box sx={{ bgcolor: BG, minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d4259 100%)`, pt: 4, pb: 5 }}>
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ReceiptLongIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem' }}>Riwayat Transaksi</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>{user.name}</Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setRefreshKey(k => k + 1)} disabled={loading}
              sx={{ color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <RefreshIcon sx={{ fontSize: 20, animation: loading ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
            </IconButton>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {[
              { label: 'Total Transaksi', value: transactions.length },
              { label: 'Berhasil',        value: transactions.filter(t => t.status === 'success').length },
              { label: 'Total Belanja',   value: `Rp ${Math.round(totalSpent / 1000)}rb` },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.12)', borderRadius: '14px', p: 1.5, textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>{value}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.63rem', fontWeight: 600 }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ mt: -2 }}>
        {/* Filter bar */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2, mb: 2.5, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Cari paket / kode..."
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#aaa' }} /></InputAdornment> }}
            sx={{
              flex: 1, minWidth: 160,
              '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e0e3ec' }, '&:hover fieldset': { borderColor: ACCENT }, '&.Mui-focused fieldset': { borderColor: ACCENT } }
            }} />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              startAdornment={<FilterListIcon sx={{ fontSize: 16, mr: 0.5, color: '#aaa' }} />}
              sx={{ borderRadius: '10px', fontSize: '0.85rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e3ec' } }}>
              <MenuItem value="all">Semua Status</MenuItem>
              <MenuItem value="success">Berhasil</MenuItem>
              <MenuItem value="pending">Menunggu</MenuItem>
              <MenuItem value="failed">Gagal</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}
            action={<Button size="small" onClick={() => setRefreshKey(k => k + 1)} sx={{ color: ACCENT, fontWeight: 700 }}>Coba Lagi</Button>}>
            {error}
          </Alert>
        )}

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: '18px', mb: 1.5 }} />
          ))
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ReceiptLongIcon sx={{ fontSize: 56, color: '#ddd', mb: 2 }} />
            <Typography sx={{ fontWeight: 700, color: '#999', mb: 0.5 }}>
              {transactions.length === 0 ? 'Belum ada transaksi' : 'Tidak ada hasil'}
            </Typography>
            <Typography sx={{ color: '#bbb', fontSize: '0.85rem', mb: 3 }}>
              {transactions.length === 0 ? 'Mulai beli paket data favoritmu!' : 'Coba kata kunci atau filter lain'}
            </Typography>
            {transactions.length === 0 && (
              <Button variant="contained" onClick={() => navigate('/')} startIcon={<ShoppingCartIcon />}
                sx={{ bgcolor: ACCENT, borderRadius: '12px', fontWeight: 700, textTransform: 'none', boxShadow: `0 6px 20px ${ACCENT}40` }}>
                Beli Paket Sekarang
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 600, pl: 0.5 }}>
              {filtered.length} transaksi ditemukan
            </Typography>
            {filtered.map(trx => <TransactionCard key={trx.id} trx={trx} />)}
          </Box>
        )}
      </Container>
    </Box>
  );
}
