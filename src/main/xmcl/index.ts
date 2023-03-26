import { ipcMain } from 'electron';
import launchVersion from './launchVersion';
import getVersions from './getVersions';

const XMCL = () => {
  ipcMain.on('launcher/core', async (event, arg) => {
    const command = arg[0];
    switch (command) {
      case 'launch': {
        await launchVersion(event, arg[1]);
        break;
      }
      case 'getVersions': {
        const versions = await getVersions();
        event.reply('launcher/core', ['versions', versions]);
      }
      // eslint-disable-next-line no-fallthrough
      default: {
        break;
      }
    }
  });
};

export default XMCL;
