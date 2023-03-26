import { Box, styled } from '@mui/material';

export const ProgressBarContainer = styled(Box)(({ theme }) => ({
  progress: {
    width: '100%',
    height: '32px',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  paddingTop: '5px',
  paddingLeft: '5px',
  paddingRight: '5px',
  borderRadius: '10px',
  border: `3px solid ${theme.palette.primary.main}`,
  'progress::-webkit-progress-value': {
    background: theme.palette.primary.main,
  },
  'progress::-webkit-progress-bar': {
    background: theme.palette.background.paper,
  },
}));
