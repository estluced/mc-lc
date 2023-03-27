import { Modal, Paper, Tabs, Tab, Box, TextField, Button } from '@mui/material';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { offline } from '@xmcl/user';
import { LoginContainer } from './styles';

function OfflineLogin({ onClose }: { onClose: () => void }) {
  const { store } = window.electron;
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userMetadataStored = store.get('userMetadata');
    if (userMetadataStored) {
      setUsername(userMetadataStored.selectedProfile.name);
    }
  }, [store]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const user = offline(username);
    store.set('userMetadata', user);
    onClose();
  };

  return (
    <LoginContainer
      sx={{
        display: 'grid',
        justifyContent: 'center',
      }}
    >
      <form style={{ marginTop: '40px' }} onSubmit={handleSubmit}>
        <Box maxWidth="240px" display="grid" gap="10px">
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Box display="flex" gap="10px">
            <Button sx={{ flex: 1 }} onClick={onClose} variant="outlined">
              Close
            </Button>
            <Button sx={{ flex: 2 }} onClick={handleSubmit} variant="contained">
              Login
            </Button>
          </Box>
        </Box>
      </form>
    </LoginContainer>
  );
}

function OfficialLogin({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <LoginContainer
      sx={{
        display: 'grid',
        justifyContent: 'center',
      }}
    >
      <form style={{ marginTop: '40px' }} onSubmit={handleSubmit}>
        <Box maxWidth="240px" display="grid" gap="14px">
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            InputProps={{
              'aria-valuemax': 4,
            }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box display="flex" gap="10px">
            <Button sx={{ flex: 1 }} onClick={onClose} variant="outlined">
              Close
            </Button>
            <Button sx={{ flex: 2 }} disabled variant="contained">
              Login
            </Button>
          </Box>
        </Box>
      </form>
    </LoginContainer>
  );
}

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

function Login({ isOpen, onClose }: LoginProps) {
  const [tabValue, setTabValue] = useState('offline');

  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          display: 'grid',
          justifyContent: 'center',
          height: '100%',
          alignContent: 'center',
        }}
      >
        <Paper
          sx={{
            width: '350px',
          }}
        >
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab sx={{ width: '50%' }} value="offline" label="Offline" />
            <Tab sx={{ width: '50%' }} value="official" label="Mojang" />
          </Tabs>
          <Box sx={{ overflow: 'hidden' }}>
            {tabValue === 'offline' && <OfflineLogin onClose={onClose} />}
            {tabValue === 'official' && <OfficialLogin onClose={onClose} />}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}

export default Login;
