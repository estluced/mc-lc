import { Box, styled } from '@mui/material';

export const ProgressBarContainer = styled(Box)(({ theme }) => ({
  progress: {
    width: '100%',
    maxHeight: '32px',
    height: '32px',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  paddingTop: '4px',
  paddingLeft: '4px',
  paddingRight: '4px',
  borderRadius: '4px',
  border: `1px solid ${theme.palette.primary.main}`,
  'progress::-webkit-progress-value': {
    background: theme.palette.primary.main,
  },
  'progress::-webkit-progress-bar': {
    background: theme.palette.background.paper,
  },
}));
