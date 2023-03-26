import React from 'react';
import { Box } from '@mui/material';

function Home() {
  const { ipcRenderer } = window.electron;

  return (
    <Box>
      <button
        type="button"
        onClick={() => ipcRenderer.sendMessage('app', ['checkUpdate'])}
      >
        force update
      </button>
    </Box>
  );
}

export default Home;
