import { installTask, MinecraftVersion } from '@xmcl/installer';
import { Task } from '@xmcl/task';
import { ResolvedVersion } from '@xmcl/core';
import { app, IpcMainEvent } from 'electron';
import getVersions from './getVersions';

async function installVersion(event: IpcMainEvent, version: MinecraftVersion) {
  const list = await getVersions();
  const versionMetadata: MinecraftVersion = list.find(
    (v) => v.id === version.id
  )!;
  const minecraftPath = `${app.getPath('appData')}\\.mclc\\${
    versionMetadata.id
  }`;
  const installAllTask: Task<ResolvedVersion> = installTask(
    versionMetadata,
    minecraftPath
  );

  const updateTaskProgress = (task: Task) => {
    event.reply('launcher/core', [
      'versionInstallationProgress',
      {
        total: installAllTask.total,
        progress: installAllTask.progress,
        path: task.path,
      },
    ]);
  };

  const setTaskToFail = (task: Task) => {
    event.reply('launcher/core', ['versionInstallationFailed', task]);
  };

  await installAllTask.startAndWait({
    onUpdate(task: Task) {
      updateTaskProgress(task);
    },
    onFailed(task: Task) {
      setTaskToFail(task);
    },
    onPaused(task: Task<any>) {
      console.log(task.path, 'paused');
    },
    onResumed(task: Task<any>) {
      console.log(task.path, 'resumed');
    },
  });
}

export default installVersion;
