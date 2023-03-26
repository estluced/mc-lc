import { Components } from '@mui/material';

export default function Avatar(): Components['MuiAvatar'] {
  return {
    styleOverrides: {
      root: {
        borderRadius: 6,
      },
    },
  };
}
