import { Components } from '@mui/material';

export default function Button(): Components['MuiButton'] {
  return {
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
      text: {
        borderRadius: '0',
        height: '100%',
      },
    },
  };
}
