import { useEffect, useState } from 'react';
import { MinecraftVersion } from '@xmcl/installer';
import Button from '@mui/material/Button';
import { Box, TextField, Typography } from '@mui/material';
import { ProgressBarContainer } from './styles';
import Versions from './Versions';

function GameLoader() {
  const { ipcRenderer, store } = window.electron;
  const [versions, setVersions] = useState<MinecraftVersion[]>([]);
  const [selectedVersion, setSelectedVersion] =
    useState<MinecraftVersion | null>(null);
  const [progress, setProgress] = useState(1);
  const [progressMax, setProgressMax] = useState(1);
  const [versionSelectorOpen, setVersionSelectorOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [launchDisabled, setLaunchDisabled] = useState(true);
  const [installStatus, setInstallStatus] = useState('Status');

  useEffect(() => {
    const username = store.get('username');
    if (username) {
      setUsername(username);
    }
    ipcRenderer.sendMessage('launcher/core', ['getVersions']);
    ipcRenderer.on('launcher/core', (event: [string, any]) => {
      switch (event[0]) {
        case 'versions': {
          const versions = event[1];
          const storeVersion = store.get('mcVersion');
          if (storeVersion) {
            setSelectedVersion(storeVersion);
          } else {
            setSelectedVersion(versions[0]);
          }
          setLaunchDisabled(false);
          setVersions(versions);
          break;
        }
        case 'versionInstallationProgress': {
          const eventData = event[1];
          setInstallStatus(eventData.path);
          setProgress(eventData.progress);
          setProgressMax(eventData.total);
          break;
        }
        case 'versionInstallationStarted': {
          setLaunchDisabled(true);
          break;
        }
        case 'versionInstallationSuccess': {
          setInstallStatus('Status');
          setLaunchDisabled(false);
          break;
        }
        default: {
          break;
        }
      }
    });
  }, [ipcRenderer, store]);

  const launch = (version: MinecraftVersion) => {
    console.log(version);
    store.set('username', username);
    store.set('mcVersion', version);
    ipcRenderer.sendMessage('launcher/core', ['launch', { version, username }]);
  };

  const selectVersionAndLaunch = (v: MinecraftVersion) => {
    setSelectedVersion(v);
    setVersionSelectorOpen(false);
    launch(v);
  };

  return (
    <Box
      p="20px"
      display="flex"
      gap="5px"
      position="fixed"
      bottom="0"
      width="100%"
    >
      <TextField
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label="Username"
      />
      <ProgressBarContainer flex={1}>
        <Typography>{installStatus}</Typography>
        <progress value={progress} max={progressMax} />
      </ProgressBarContainer>
      <Button onClick={() => setVersionSelectorOpen(true)} variant="contained">
        {selectedVersion?.id ?? 'Select version'}
      </Button>
      <Button
        onClick={() => launch(selectedVersion!)}
        disabled={launchDisabled}
        variant="contained"
      >
        launch
      </Button>
      <Versions
        versions={versions}
        open={versionSelectorOpen}
        onClose={() => setVersionSelectorOpen(false)}
        selectVersionAndLaunch={selectVersionAndLaunch}
      />
    </Box>
  );
}

export default GameLoader;
