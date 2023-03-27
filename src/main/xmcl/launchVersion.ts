import { createMinecraftProcessWatcher, launch } from '@xmcl/core';
import { app, IpcMainEvent } from 'electron';
import { EventEmitter } from 'events';
import { MinecraftVersion } from '@xmcl/installer';
import { Authentication } from '@xmcl/user';
import installVersion from './installVersion';
import installJava from './installJava';

async function launchMinecraft(
  event: IpcMainEvent,
  {
    version,
    userMetadata,
    dedicatedMemory,
  }: {
    version: MinecraftVersion;
    userMetadata: Authentication;
    dedicatedMemory: number;
  }
) {
  const javaPath = await installJava(event);
  const java = `${javaPath}\\bin\\java.exe`;
  const minecraftPath = `${app.getPath('appData')}\\.mclc\\${version.id}`;
  event.reply('launcher/core', ['processStarted']);
  installVersion(event, version)
    .then(async () => {
      const mcProcessEvents = new EventEmitter();
      mcProcessEvents.on('minecraft-exit', () => {
        event.reply('launcher/core', ['processExited']);
      });
      const mcProcess = await launch({
        version: version.id,
        gamePath: minecraftPath,
        javaPath: java,
        isDemo: false,
        extraExecOption: { detached: true },
        maxMemory: dedicatedMemory,
        ...(userMetadata
          ? {
              accessToken: userMetadata.accessToken,
              gameProfile: userMetadata.selectedProfile,
            }
          : {}),
      });
      createMinecraftProcessWatcher(mcProcess, mcProcessEvents);
    })
    .catch(() => {
      event.reply('launcher/core', ['processExited']);
    });
}

export default launchMinecraft;
