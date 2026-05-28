import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Transaction from './pages/Transaction';
import TransactionHistory from './pages/TransactionHistory';
import Customer from './pages/Customer';

const theme = createTheme({
  palette: {
    primary: { main: '#E53935' },
    secondary: { main: '#1F2D3D' },
    background: { default: '#F0F2F9' },
  },
  typography: {
    fontFamily: '"DM Sans", "Nunito", "Helvetica Neue", sans-serif',
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 } },
  },
});

function WithNav({ children }) {
  return <><Navbar />{children}</>;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<WithNav><Dashboard /></WithNav>} />
            <Route path="/transaction" element={<WithNav><Transaction /></WithNav>} />
            <Route path="/history" element={<WithNav><TransactionHistory /></WithNav>} />
            <Route path="/customer" element={<WithNav><Customer /></WithNav>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
