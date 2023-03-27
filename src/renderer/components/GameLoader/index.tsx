import { useEffect, useState } from 'react';
import { MinecraftVersion } from '@xmcl/installer';
import Button from '@mui/material/Button';
import { Box, ButtonGroup } from '@mui/material';
import { Authentication } from '@xmcl/user';
import { ProgressBarContainer } from './styles';
import Versions from './Versions';
import Login from './Login';
import Settings from './Settings';

function calculateMemoryAllocation(totalMemory: number) {
  const minAllocationSize = 2048;
  const minMemoryAllocation = Math.max(minAllocationSize, totalMemory * 0.1);
  return Math.ceil(minMemoryAllocation);
}

function GameLoader() {
  const { ipcRenderer, store } = window.electron;
  const [versions, setVersions] = useState<MinecraftVersion[]>([]);
  const [selectedVersion, setSelectedVersion] =
    useState<MinecraftVersion | null>(null);
  const [progress, setProgress] = useState(1);
  const [progressMax, setProgressMax] = useState(1);
  const [versionSelectorOpen, setVersionSelectorOpen] = useState(false);
  const [userMetadata, setUserMetadata] = useState<Authentication | null>(null);
  const [launchDisabled, setLaunchDisabled] = useState(true);
  const [installStatus, setInstallStatus] = useState('Status');
  const [loginModal, setLoginModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const loadUserMetadata = () => {
    const userMetadataStored = store.get('userMetadata');
    if (userMetadataStored) {
      setUserMetadata(userMetadataStored);
    }
  };

  useEffect(() => {
    loadUserMetadata();
    ipcRenderer.sendMessage('app', ['checkUpdate']);
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
          console.log(event[1].total, event[1].progress);
          setInstallStatus(eventData.path);
          setProgress(eventData.progress);
          setProgressMax(eventData.total);
          break;
        }
        case 'processStarted': {
          setLaunchDisabled(true);
          break;
        }
        case 'processExited': {
          setInstallStatus('Status');
          setLaunchDisabled(false);
          break;
        }
        default: {
          break;
        }
      }
    });
    ipcRenderer.on('app', (event: [string, any]) => {
      switch (event[0]) {
        case 'updateAvailable': {
          console.log(event[1]);
          break;
        }
        case 'updateProgress': {
          setInstallStatus('launcherUpdater.downloadingUpdate');
          setProgressMax(event[1].total);
          setProgress(event[1].transferred);
          break;
        }
        case 'updateNotAvailable': {
          console.log('updateNotAvailable', event[1]);
          break;
        }
        case 'updateError': {
          console.log('updateError', event[1]);
          break;
        }
        default: {
          break;
        }
      }
    });
  }, [ipcRenderer, store]);

  const launch = (version: MinecraftVersion) => {
    const dedicatedMemory =
      // eslint-disable-next-line no-bitwise
      store.get('dedicatedMemory') |
      calculateMemoryAllocation(store.get('totalMemory'));
    ipcRenderer.sendMessage('launcher/core', [
      'launch',
      { version, userMetadata, dedicatedMemory },
    ]);
  };

  const selectVersionAndLaunch = (v: MinecraftVersion) => {
    setSelectedVersion(v);
    setVersionSelectorOpen(false);
  };

  return (
    <Box
      p="10px"
      display="flex"
      gap="10px"
      position="fixed"
      bottom="0"
      width="100%"
    >
      <Button
        sx={{
          width: '100px',
        }}
        variant="outlined"
        onClick={() => setLoginModal(true)}
      >
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {userMetadata?.selectedProfile?.name ?? 'Login'}
        </div>
      </Button>
      <ProgressBarContainer flex={1}>
        <progress value={progress} max={progressMax} />
      </ProgressBarContainer>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={() => setVersionSelectorOpen(true)}>
          {selectedVersion?.id ?? 'Select version'}
        </Button>
        <Button onClick={() => setSettingsModal(true)}>s</Button>
        <Button
          onClick={() => launch(selectedVersion!)}
          disabled={launchDisabled}
          variant="contained"
        >
          Launch
        </Button>
      </ButtonGroup>
      <Versions
        versions={versions}
        open={versionSelectorOpen}
        onClose={() => setVersionSelectorOpen(false)}
        selectVersionAndLaunch={selectVersionAndLaunch}
      />
      <Settings
        isOpen={settingsModal}
        onClose={() => setSettingsModal(false)}
      />
      <Login
        isOpen={loginModal}
        onClose={() => {
          setLoginModal(false);
          loadUserMetadata();
        }}
      />
    </Box>
  );
}

export default GameLoader;
