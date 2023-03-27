import { Components, Theme } from '@mui/material';

import CssBaseLine from './components/CssBaseLine';
import SvgIcon from './components/SvgIcon';
import Button from './components/Button';
import Avatar from './components/Avatar';
import Paper from './components/Paper';
import TextField from './components/TextField';

const getOverrides = (theme: Theme): Components => ({
  MuiCssBaseline: CssBaseLine(),
  MuiSvgIcon: SvgIcon(),
  MuiButton: Button(),
  MuiAvatar: Avatar(),
  MuiPaper: Paper(theme),
  MuiTextField: TextField(theme),
});

export default getOverrides;
