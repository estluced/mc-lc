import { createTheme } from '@mui/material';
import palette from './palette';
import getOverrides from './overrides';

const theme = createTheme({ palette });

theme.components = getOverrides(theme);

export default theme;
