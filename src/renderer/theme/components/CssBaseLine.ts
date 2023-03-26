import { Components } from '@mui/material';

export default function CssBaseLine(): Components['MuiCssBaseline'] {
  return {
    styleOverrides: {
      '*::-webkit-scrollbar': {
        width: '10px',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey',
      },
      body: {
        margin: 0,
      },
    },
  };
}
