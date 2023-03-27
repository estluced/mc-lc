import { Components, Theme } from '@mui/material';

export default function TextField(theme: Theme): Components['MuiTextField'] {
  return {
    styleOverrides: {
      root: {
        '.MuiInputBase-root': {
          outline: 'none',
          fieldset: {
            borderColor: theme.palette.primary.main,
          },
        },
      },
    },
  };
}
