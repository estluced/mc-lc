import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { Close, Remove } from '@mui/icons-material';

function Header() {
  const { ipcRenderer } = window.electron;
  const drag = { appRegion: 'drag' };
  const noDrag = { appRegion: 'no-drag' };

  const minimizeApp = () => {
    ipcRenderer.sendMessage('app', ['minimize']);
  };

  const quitApp = () => {
    ipcRenderer.sendMessage('app', ['quit']);
  };

  return (
    <Box sx={drag} display="flex" justifyContent="space-between" height="42px">
      <Box />
      <Box sx={noDrag}>
        <Button onClick={minimizeApp}>
          <Remove sx={{ fontSize: '16px' }} />
        </Button>
        <Button onClick={quitApp}>
          <Close sx={{ fontSize: '16px' }} />
        </Button>
      </Box>
    </Box>
  );
}

export default Header;
