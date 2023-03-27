import {
  installJavaRuntimesTask,
  fetchJavaRuntimeManifest,
  JavaRuntimeManifest,
} from '@xmcl/installer';
import { Task } from '@xmcl/task';
import { app, IpcMainEvent } from 'electron';

async function installJava(event: IpcMainEvent) {
  const destination = `${app.getPath('appData')}\\.mclc\\java`;
  const manifest: JavaRuntimeManifest = await fetchJavaRuntimeManifest();
  const installJavaTask: Task<void> = installJavaRuntimesTask({
    manifest,
    destination,
  });

  const updateTaskProgress = (task: Task) => {
    event.reply('launcher/core', [
      'versionInstallationProgress',
      { total: task.total, progress: task.progress, path: task.path },
    ]);
  };

  const setTaskToFail = (task: Task) => {
    event.reply('launcher/core', ['versionInstallationFailed', task]);
  };

  await installJavaTask.startAndWait({
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
  return destination;
}

export default installJava;
