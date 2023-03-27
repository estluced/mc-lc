import {
  Box,
  Button,
  Modal,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { StyledSlider } from './styles';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

function MinecraftSettings({ onClose }: { onClose: () => void }) {
  const { store } = window.electron;
  const [sliderRamMarks, setSliderRamMarks] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [sliderRamValue, setSliderRamValue] = useState<number>(0);

  useEffect(() => {
    const totalMemory = store.get('totalRam');
    const dedicatedMemory = store.get('dedicatedMemory');
    const allocationSize = 2048;
    const allocationCount = Math.floor(totalMemory / allocationSize);
    const allocations = Array.from(
      { length: allocationCount },
      (v, i) => (i + 1) * allocationSize
    ).map((value) => ({
      value,
      label: `${value} MB`,
    }));
    setSliderRamMarks(allocations);
    setSliderRamValue(dedicatedMemory);
  }, [store]);

  const saveSettings = () => {
    store.set('dedicatedMemory', sliderRamValue);
    onClose();
  };

  return (
    <Box
      sx={{
        display: 'grid',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Box width="550px">
        <Typography>RAM</Typography>
        {sliderRamMarks.length > 0 && (
          <StyledSlider
            value={sliderRamValue}
            onChange={(event, newValue) =>
              setSliderRamValue(newValue as number)
            }
            min={sliderRamMarks[0].value}
            getAriaValueText={(value) => `${value} MB`}
            step={2048}
            max={sliderRamMarks[sliderRamMarks.length - 1].value}
            marks={sliderRamMarks}
            valueLabelDisplay="on"
          />
        )}
        <Typography>{sliderRamValue} GB</Typography>
      </Box>
      <Button variant="contained" onClick={saveSettings}>
        Save
      </Button>
    </Box>
  );
}

function LauncherSettings() {
  const { ipcRenderer } = window.electron;
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => ipcRenderer.sendMessage('app', ['checkUpdate'])}
      >
        force update
      </Button>
    </Box>
  );
}

function Settings({ isOpen, onClose }: SettingsProps) {
  const [tabValue, setTabValue] = useState('minecraft');

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
            width: '600px',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            position="relative"
            height="48px"
            justifyContent="space-between"
          >
            <Tabs value={tabValue} onChange={handleChangeTab}>
              <Tab value="minecraft" label="Minecraft" />
              <Tab value="launcher" label="Launcher" />
            </Tabs>
            <Button onClick={onClose} sx={{ height: '100%' }}>
              <Close sx={{ fontSize: '20px' }} />
            </Button>
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            {tabValue === 'minecraft' && (
              <MinecraftSettings onClose={onClose} />
            )}
            {tabValue === 'launcher' && <LauncherSettings />}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}

export default Settings;
