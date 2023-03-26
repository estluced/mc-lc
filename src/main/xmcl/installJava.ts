import {
  installJavaRuntimesTask,
  fetchJavaRuntimeManifest,
  JavaRuntimeManifest,
} from '@xmcl/installer';
import { Task } from '@xmcl/task';
import { app, IpcMainEvent } from 'electron';

async function installJava(event: IpcMainEvent) {
  const destination = `${app.getPath('appData')}\\.mc-cl\\java`;
  const manifest: JavaRuntimeManifest = await fetchJavaRuntimeManifest();
  const installJavaTask: Task<void> = installJavaRuntimesTask({
    manifest,
    destination,
  });

  event.reply('launcher/core', ['console.log', { manifest, destination }]);

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

  await installJavaTask.startAndWait({
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
  return destination;
}

export default installJava;
