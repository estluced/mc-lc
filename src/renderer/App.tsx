import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import Home from './screens/Home';
import Header from './components/Header';
import theme from './theme';
import GameLoader from './components/GameLoader';

export default function App() {
  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.on('launcher/core', (event: [string, any]) => {
      if (event[0] === 'console.log') console.log(event[1]);
    });
  }, [ipcRenderer]);

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
