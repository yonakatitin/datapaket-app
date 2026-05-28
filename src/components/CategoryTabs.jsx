import { Box, Typography } from '@mui/material';
import SimCardIcon from '@mui/icons-material/SimCard';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MovieIcon from '@mui/icons-material/Movie';
import FlightIcon from '@mui/icons-material/Flight';
import PhoneIcon from '@mui/icons-material/Phone';
import CloudIcon from '@mui/icons-material/Cloud';
import TodayIcon from '@mui/icons-material/Today';
import StarIcon from '@mui/icons-material/Star';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import AppsIcon from '@mui/icons-material/Apps';

const ACCENT = '#E53935';

export const CATEGORIES = [
  { label: 'Semua',          icon: <SignalCellularAltIcon sx={{ fontSize: 18 }} />, value: 'all' },
  { label: 'IM3 SIM',        icon: <SimCardIcon sx={{ fontSize: 18 }} />,           value: 'IM3 SIM' },
  { label: 'Paket Data',     icon: <SignalCellularAltIcon sx={{ fontSize: 18 }} />,value: 'Paket Data aktif' },
  { label: 'BestSeller',     icon: <WhatshotIcon sx={{ fontSize: 18 }} />,          value: 'BestSeller' },
  { label: 'Hiburan',        icon: <MovieIcon sx={{ fontSize: 18 }} />,             value: 'Hiburan' },
  { label: 'Roaming',        icon: <FlightIcon sx={{ fontSize: 18 }} />,            value: 'Roaming' },
  { label: 'Call & SMS',     icon: <PhoneIcon sx={{ fontSize: 18 }} />,             value: 'Call & SMS' },
  { label: 'Super Kuota',    icon: <CloudIcon sx={{ fontSize: 18 }} />,             value: 'Freedom Internet Super Kuota' },
  { label: 'Harian',         icon: <TodayIcon sx={{ fontSize: 18 }} />,             value: 'Freedom Internet Harian' },
  { label: 'Spesial',        icon: <StarIcon sx={{ fontSize: 18 }} />,              value: 'Freedom Special' },
  { label: 'Freedom Play',   icon: <PlayCircleIcon sx={{ fontSize: 18 }} />,        value: 'Freedom Play' },
  { label: 'SIM Lifetime',   icon: <AllInclusiveIcon sx={{ fontSize: 18 }} />,      value: 'SIM Lifetime' },
  { label: 'Apps Fun',       icon: <AppsIcon sx={{ fontSize: 18 }} />,              value: 'Freedom Apps Fun' },
];

export default function CategoryTabs({ selected, onChange }) {
  return (
    // Outer wrapper: clips vertically but NEVER clips horizontal scroll
    <Box sx={{ position: 'relative', overflow: 'visible' }}>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'visible',
          gap: '8px',
          pb: 1,
          pt: 0.5,
          // Hide scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          // Let items start at the left edge and scroll right
          px: 0,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.value;
          return (
            <Box
              key={cat.value}
              onClick={() => onChange(cat.value)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                // Fixed width so nothing gets clipped
                minWidth: '68px',
                width: '68px',
                flexShrink: 0,
                cursor: 'pointer',
                px: '6px',
                py: '10px',
                borderRadius: '14px',
                transition: 'all 0.2s',
                bgcolor: isActive ? `${ACCENT}12` : 'transparent',
                border: '1.5px solid',
                borderColor: isActive ? `${ACCENT}40` : 'transparent',
                '&:hover': {
                  bgcolor: `${ACCENT}0a`,
                  borderColor: `${ACCENT}25`,
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive
                    ? `linear-gradient(135deg, ${ACCENT}, #ff6b6b)`
                    : '#f0f2f9',
                  color: isActive ? '#fff' : '#666',
                  boxShadow: isActive ? `0 4px 12px ${ACCENT}40` : 'none',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {cat.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? ACCENT : '#666',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                {cat.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
