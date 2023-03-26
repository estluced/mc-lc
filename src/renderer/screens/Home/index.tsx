import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

function Home() {
  const { ipcRenderer } = window.electron;
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    ipcRenderer.on('app', (event: [string, any]) => {
      switch (event[0]) {
        case 'updateAvailable': {
          setUpdateAvailable(true);
          break;
        }
        default: {
          break;
        }
      }
    });
  }, [ipcRenderer]);

  return (
    <Box>
      <h1>{updateAvailable ? 'Update' : 'Home'}</h1>
    </Box>
  );
}

export default Home;
