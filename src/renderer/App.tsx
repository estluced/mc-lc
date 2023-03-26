import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Home from './screens/Home';
import Header from './components/Header';
import theme from './theme';
import GameLoader from './components/GameLoader';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <GameLoader />
    </ThemeProvider>
  );
}
