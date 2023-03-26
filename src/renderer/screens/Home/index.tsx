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
          console.log(event[1]);
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
      <button
        type="button"
        onClick={() => ipcRenderer.sendMessage('app', ['checkUpdate'])}
      >
        check upd
      </button>
      <h1>{updateAvailable ? 'Update' : 'Home'}</h1>
    </Box>
  );
}

export default Home;
