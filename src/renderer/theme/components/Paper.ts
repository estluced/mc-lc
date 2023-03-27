import { Components, Theme } from '@mui/material';

export default function Paper(theme: Theme): Components['MuiPaper'] {
  return {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        border: `2px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        overflow: 'hidden',
        outline: 'none',
      },
    },
  };
}
