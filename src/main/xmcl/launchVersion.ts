import { Authentication, offline } from '@xmcl/user';
import { createMinecraftProcessWatcher, launch } from '@xmcl/core';
import { app, IpcMainEvent } from 'electron';
import { EventEmitter } from 'events';
import { MinecraftVersion } from '@xmcl/installer';
import installVersion from './installVersion';
import installJava from './installJava';

async function launchMinecraft(
  event: IpcMainEvent,
  { version, username }: { version: MinecraftVersion; username: string }
) {
  const javaPath = await installJava(event);
  const java = `${javaPath}\\bin\\java.exe`;
  const minecraftPath = `${app.getAppPath()}\\minecraft\\${version.id}`;
  const authOffline: Authentication = offline(username);
  installVersion(event, version)
    .then(async () => {
      const mcProcessEvents = new EventEmitter();
      mcProcessEvents.on('minecraft-window-ready', () => {
        event.reply('launcher/core', ['gameStarted']);
      });
      mcProcessEvents.on('minecraft-exit', () => {
        event.reply('launcher/core', ['gameClosed']);
      });
      const mcProcess = await launch({
        version: version.id,
        gamePath: minecraftPath,
        javaPath: java,
        accessToken: authOffline.accessToken,
        isDemo: false,
        gameName: `${version} | ${authOffline.user?.username}`,
        gameProfile: authOffline.selectedProfile,
        extraExecOption: { detached: true },
      });
      createMinecraftProcessWatcher(mcProcess, mcProcessEvents);
    })
    .catch(console.log);
}

export default launchMinecraft;
