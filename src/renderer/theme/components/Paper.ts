import { Components } from '@mui/material';

export default function Paper(): Components['MuiPaper'] {
  return {
    styleOverrides: {
      root: {
        outline: 'none',
      },
    },
  };
}
