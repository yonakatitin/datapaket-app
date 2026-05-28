import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Container, Typography, TextField, InputAdornment,
  Grid, Skeleton, Alert, Chip, Paper, Button, LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PackageCard from '../components/PackageCard';
import CategoryTabs from '../components/CategoryTabs';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';
const BG = '#F0F2F9';

// Flash Sale timer component
function FlashSaleTimer() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(t => {
        let { h, m, s } = t;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.25)', px: 1, py: 0.3,
            borderRadius: '6px', fontWeight: 900, fontSize: '1rem',
            fontFamily: 'monospace', color: '#fff', minWidth: 30, textAlign: 'center'
          }}>{val}</Box>
          {i < 2 && <Typography sx={{ color: '#fff', fontWeight: 900, opacity: 0.8 }}>:</Typography>}
        </Box>
      ))}
    </Box>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch('http://localhost:3001/packages')
      .then(r => r.json())
      .then(data => { setPackages(data); setLoading(false); })
      .catch(() => { setError('Gagal memuat paket. Pastikan json-server berjalan.'); setLoading(false); });
  }, []);

  const handleBuy = (pkg) => {
    if (!user) {
      navigate('/login', { state: { redirectPkg: pkg } });
    } else {
      navigate('/transaction', { state: { pkg } });
    }
  };

  const filtered = packages.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    if (category === 'all') return matchSearch;
    if (category === 'BestSeller') return matchSearch && p.bestseller;
    return matchSearch && p.category === category;
  });

  const flashSalePackages = packages.filter(p => p.badge === 'FLASH SALE' || p.featured).slice(0, 3);
  const bestDeals = packages.filter(p => p.badge === 'BEST DEAL' || p.badge === 'TERLARIS').slice(0, 2);

  // Active package usage bar
  const usagePercent = user?.activePackage
    ? Math.round((parseFloat(user.activePackage.remaining) / parseFloat(user.activePackage.quota)) * 100)
    : 0;

  return (
    <Box sx={{ bgcolor: BG, minHeight: '100vh' }}>
      {/* Hero section */}
      <Box sx={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #2d4259 50%, #1a3a5c 100%)`,
        pt: { xs: 4, md: 5 }, pb: { xs: 6, md: 8 },
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(229,57,53,0.12)' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          {/* Active package banner — only for logged-in users */}
          {user?.activePackage && (
            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px', p: 2, mb: 3, cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
              transition: 'all 0.2s'
            }}
              onClick={() => navigate('/customer')}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Paket Aktif
                  </Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                    {user.activePackage.name}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip label={`Berakhir ${new Date(user.activePackage.expiry).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                    size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                      Sisa: <strong style={{ color: '#fff' }}>{user.activePackage.remaining}</strong>
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                      {usagePercent}% tersisa
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate" value={usagePercent}
                    sx={{
                      height: 7, borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.15)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: usagePercent < 20 ? '#ff6b6b' : usagePercent < 50 ? '#FFB74D' : '#69F0AE',
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Hero text */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
              {user ? `Halo, ${user.name.split(' ')[0]} 👋` : 'Selamat datang di'}
            </Typography>
            <Typography sx={{
              color: '#fff', fontWeight: 900,
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              lineHeight: 1.15, letterSpacing: '-1px'
            }}>
              Paket Internet<br />
              <Box component="span" sx={{
                background: `linear-gradient(90deg, ${ACCENT}, #ff8a80)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Terlengkap
              </Box>{' '}& Termurah
            </Typography>
          </Box>

          {/* Search bar */}
          <TextField
            fullWidth
            placeholder="Cari paket data, provider, kategori..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                color: '#fff',
                '& fieldset': { border: '1.5px solid rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: `${ACCENT}` },
                '& input::placeholder': { color: 'rgba(255,255,255,0.45)' },
              },
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -3, pb: 6, overflow: "visible" }}>
        {/* Flash Sale Banner */}
        {!search && category === 'all' && (
          <Paper elevation={0} sx={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, #ff5252 50%, #ff1744 100%)`,
            borderRadius: '20px', p: 2.5, mb: 3,
            overflow: 'hidden', position: 'relative',
          }}>
            <Box sx={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BoltIcon sx={{ color: '#FFD600', fontSize: 28 }} />
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', lineHeight: 1 }}>FLASH SALE</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem' }}>Penawaran terbatas hari ini</Typography>
                </Box>
              </Box>
              <FlashSaleTimer />
            </Box>
            <Grid container spacing={1.5}>
              {loading
                ? [1, 2, 3].map(i => <Grid item xs={12} sm={4} key={i}><Skeleton variant="rounded" height={140} sx={{ borderRadius: '12px' }} /></Grid>)
                : flashSalePackages.map(pkg => (
                  <Grid item xs={12} sm={4} key={pkg.id}>
                    <Box sx={{
                      bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '14px',
                      p: 1.8, backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                      transition: 'all 0.2s'
                    }}>
                      <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {pkg.provider}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', mb: 0.3 }}>{pkg.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <WifiIcon sx={{ fontSize: 13, color: '#FFD600' }} />
                        <Typography sx={{ color: '#FFD600', fontWeight: 900, fontSize: '0.85rem' }}>{pkg.quota}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem', textDecoration: 'line-through' }}>
                            Rp {pkg.originalPrice?.toLocaleString('id-ID')}
                          </Typography>
                          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem' }}>
                            Rp {pkg.price.toLocaleString('id-ID')}
                          </Typography>
                        </Box>
                        <Button
                          size="small" variant="contained"
                          onClick={() => handleBuy(pkg)}
                          sx={{
                            bgcolor: '#fff', color: ACCENT, fontWeight: 800,
                            fontSize: '0.72rem', borderRadius: '20px', px: 1.5, py: 0.4,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#f5f5f5' }
                          }}>Beli</Button>
                      </Box>
                    </Box>
                  </Grid>
                ))
              }
            </Grid>
          </Paper>
        )}

        {/* Best Deal Section */}
        {!search && category === 'all' && bestDeals.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon sx={{ color: '#FFB300', fontSize: 22 }} />
                <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: NAVY }}>Best Deal</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ color: ACCENT, fontWeight: 700, textTransform: 'none', fontSize: '0.8rem' }}>
                Lihat Semua
              </Button>
            </Box>
            <Grid container spacing={2}>
              {bestDeals.map(pkg => (
                <Grid item xs={12} sm={6} key={pkg.id}>
                  <PackageCard pkg={pkg} onBuy={handleBuy} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Category Tabs */}
        <Box sx={{ mb: 2.5, mx: { xs: -2, sm: -3, md: -3 }, px: { xs: 2, sm: 3, md: 3 }, overflow: "visible" }}>
          <CategoryTabs selected={category} onChange={setCategory} />
        </Box>

        {/* Error */}
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

        {/* Package Grid Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: NAVY }}>
            {search ? `Hasil pencarian "${search}"` : category === 'all' ? 'Semua Paket' : category}
            {!loading && <Box component="span" sx={{ ml: 1, fontSize: '0.8rem', fontWeight: 600, color: '#999' }}>({filtered.length})</Box>}
          </Typography>
        </Box>

        {/* Package Grid */}
        <Grid container spacing={2}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={6} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))
            : filtered.length === 0
              ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <WifiIcon sx={{ fontSize: 52, color: '#ddd', mb: 2 }} />
                    <Typography sx={{ color: '#999', fontWeight: 600 }}>Paket tidak ditemukan</Typography>
                    <Typography sx={{ color: '#bbb', fontSize: '0.85rem' }}>Coba kata kunci lain atau pilih kategori berbeda</Typography>
                  </Box>
                </Grid>
              )
              : filtered.map(pkg => (
                <Grid item xs={6} sm={6} md={4} key={pkg.id}>
                  <PackageCard pkg={pkg} onBuy={handleBuy} compact />
                </Grid>
              ))
          }
        </Grid>
      </Container>
    </Box>
  );
}
