import {
  Box,
  Modal,
  Paper,
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { MinecraftVersion } from '@xmcl/installer';
import React, { useEffect } from 'react';

interface VersionsProps {
  versions: MinecraftVersion[];
  open: boolean;
  onClose: () => void;
  selectVersionAndLaunch: (v: MinecraftVersion) => void;
}

function VersionRow({
  version,
  selectVersionAndLaunch,
}: {
  version: MinecraftVersion;
  selectVersionAndLaunch: (v: MinecraftVersion) => void;
}) {
  return (
    <ListItem key={version.id} component="div" disablePadding>
      <ListItemButton onClick={() => selectVersionAndLaunch(version)}>
        <ListItemText primary={`Minecraft ${version.id}`} />
      </ListItemButton>
    </ListItem>
  );
}

function Versions({
  versions,
  open,
  onClose,
  selectVersionAndLaunch,
}: VersionsProps) {
  const [viewSnapshots, setViewSnapshots] = React.useState(false);
  const [versionsToShow, setVersionsToShow] = React.useState(versions);

  useEffect(() => {
    if (viewSnapshots) {
      setVersionsToShow(versions);
    } else {
      setVersionsToShow(
        versions.filter((version) => version.type === 'release')
      );
    }
  }, [versions, viewSnapshots]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'grid',
          justifyContent: 'center',
          height: '100%',
          alignContent: 'center',
        }}
      >
        <Paper sx={{ width: '350px', position: 'relative' }}>
          <Box p="20px">
            <Typography>Select version</Typography>
            <Button onClick={onClose}>close</Button>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={viewSnapshots}
                    onChange={() => setViewSnapshots(!viewSnapshots)}
                  />
                }
                label="View snapshots"
              />
            </FormGroup>
          </Box>
          <Box
            sx={{
              height: '350px',
              boxSizing: 'border-box',
              overflowX: 'auto',
              borderTop: '1px solid #fff',
            }}
          >
            {versionsToShow.map((version) => (
              <VersionRow
                version={version}
                selectVersionAndLaunch={selectVersionAndLaunch}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}

export default Versions;
