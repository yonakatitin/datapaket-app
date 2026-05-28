import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';

const ACCENT = '#E53935';
const NAVY = '#1F2D3D';

const BADGE_STYLES = {
  'TERLARIS':    { bg: '#FF6D00', color: '#fff' },
  'HEMAT':       { bg: '#2E7D32', color: '#fff' },
  'BEST DEAL':   { bg: NAVY,      color: '#fff' },
  'FLASH SALE':  { bg: ACCENT,    color: '#fff' },
  'POPULER':     { bg: '#7B1FA2', color: '#fff' },
  'SPESIAL':     { bg: '#1565C0', color: '#fff' },
  'ALL-IN':      { bg: '#00838F', color: '#fff' },
  'BARU':        { bg: '#00897B', color: '#fff' },
  'LIFETIME':    { bg: '#4527A0', color: '#fff' },
};

export default function PackageCard({ pkg, onBuy, compact = false }) {
  const discount = pkg.originalPrice
    ? Math.round((1 - pkg.price / pkg.originalPrice) * 100)
    : 0;

  const badgeStyle = BADGE_STYLES[pkg.badge] || { bg: '#888', color: '#fff' };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1.5px solid',
        borderColor: pkg.featured ? `${ACCENT}30` : '#e8eaf0',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        background: pkg.featured
          ? `linear-gradient(145deg, #fff 0%, #fff8f8 100%)`
          : '#fff',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: pkg.featured
            ? `0 12px 32px ${ACCENT}20`
            : '0 8px 24px rgba(0,0,0,0.10)',
          borderColor: pkg.featured ? `${ACCENT}60` : '#c5c8d8',
        },
      }}
    >
      {/* Badge */}
      {pkg.badge && (
        <Box sx={{
          position: 'absolute', top: -10, left: 14,
          bgcolor: badgeStyle.bg, color: badgeStyle.color,
          px: 1.2, py: 0.3,
          borderRadius: '6px',
          fontSize: '0.62rem', fontWeight: 800,
          letterSpacing: '0.5px',
          boxShadow: `0 3px 8px ${badgeStyle.bg}50`,
          zIndex: 1,
          display: 'flex', alignItems: 'center', gap: 0.4
        }}>
          {pkg.badge === 'TERLARIS' && <LocalFireDepartmentIcon sx={{ fontSize: 10 }} />}
          {pkg.badge === 'BEST DEAL' && <StarIcon sx={{ fontSize: 10 }} />}
          {pkg.badge}
        </Box>
      )}

      {/* Discount tag */}
      {discount > 0 && (
        <Box sx={{
          position: 'absolute', top: -10, right: 14,
          bgcolor: '#FFF3E0', color: '#E65100',
          px: 1, py: 0.3, borderRadius: '6px',
          fontSize: '0.65rem', fontWeight: 800,
          border: '1px solid #FFB74D40',
        }}>
          -{discount}%
        </Box>
      )}

      <CardContent sx={{ p: compact ? 1.8 : 2.2, pb: compact ? '1.4rem !important' : '1.8rem !important' }}>
        {/* Provider label */}
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', mb: 0.5 }}>
          {pkg.provider}
        </Typography>

        {/* Package name */}
        <Typography sx={{
          fontWeight: 800, fontSize: compact ? '0.9rem' : '1rem',
          color: NAVY, lineHeight: 1.3, mb: 1,
          letterSpacing: '-0.2px'
        }}>
          {pkg.name}
        </Typography>

        {/* Quota highlight */}
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.6,
          bgcolor: `${ACCENT}10`, borderRadius: '8px',
          px: 1.2, py: 0.5, mb: 1.5
        }}>
          <WifiIcon sx={{ fontSize: 14, color: ACCENT }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: ACCENT, letterSpacing: '-0.3px' }}>
            {pkg.quota}
          </Typography>
        </Box>

        {/* Validity */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, opacity: 0.7 }}>
          <AccessTimeIcon sx={{ fontSize: 13, color: '#666' }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>
            Berlaku {pkg.validity}
          </Typography>
        </Box>

        {/* Description */}
        {!compact && (
          <Typography sx={{ fontSize: '0.75rem', color: '#888', mb: 1.5, lineHeight: 1.5 }}>
            {pkg.description}
          </Typography>
        )}

        {/* Price row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 'auto' }}>
          <Box>
            {pkg.originalPrice && pkg.originalPrice !== pkg.price && (
              <Typography sx={{ fontSize: '0.72rem', color: '#bbb', textDecoration: 'line-through', lineHeight: 1 }}>
                Rp {pkg.originalPrice.toLocaleString('id-ID')}
              </Typography>
            )}
            <Typography sx={{
              fontSize: compact ? '1.1rem' : '1.25rem',
              fontWeight: 900, color: NAVY, letterSpacing: '-0.5px', lineHeight: 1.2
            }}>
              Rp {pkg.price.toLocaleString('id-ID')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => { e.stopPropagation(); onBuy(pkg); }}
            sx={{
              bgcolor: ACCENT, borderRadius: '20px',
              fontWeight: 800, fontSize: '0.75rem',
              px: 2, py: 0.7,
              textTransform: 'none',
              boxShadow: `0 4px 12px ${ACCENT}40`,
              '&:hover': { bgcolor: '#c62828', transform: 'scale(1.04)', boxShadow: `0 6px 16px ${ACCENT}50` },
              transition: 'all 0.2s',
            }}
          >
            Beli
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
