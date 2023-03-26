import { Components } from '@mui/material';

import CssBaseLine from './components/CssBaseLine';
import SvgIcon from './components/SvgIcon';
import Button from './components/Button';
import Avatar from './components/Avatar';
import Paper from './components/Paper';

const getOverrides = (): Components => ({
  MuiCssBaseline: CssBaseLine(),
  MuiSvgIcon: SvgIcon(),
  MuiButton: Button(),
  MuiAvatar: Avatar(),
  MuiPaper: Paper(),
});

export default getOverrides;
