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
  const minecraftPath = `${app.getPath('appData')}\\.mc-cl\\${
    versionMetadata.id
  }`;
  const installAllTask: Task<ResolvedVersion> = installTask(
    versionMetadata,
    minecraftPath
  );

  const updateTaskProgress = (task: Task) => {
    event.reply('launcher/core', [
      'versionInstallationProgress',
      { total: task.total, progress: task.progress, path: task.path },
    ]);
  };

  const trackTask = () => {
    event.reply('launcher/core', ['versionInstallationStarted']);
  };

  const setTaskToFail = (task: Task) => {
    event.reply('launcher/core', ['versionInstallationFailed', task]);
  };

  const setTaskToSuccess = () => {
    event.reply('launcher/core', ['versionInstallationSuccess']);
  };

  await installAllTask.startAndWait({
    onStart() {
      trackTask();
    },
    onUpdate(task: Task) {
      updateTaskProgress(task);
    },
    onFailed(task: Task) {
      setTaskToFail(task);
    },
    onSucceed() {
      setTaskToSuccess();
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
