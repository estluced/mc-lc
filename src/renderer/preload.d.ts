import { ElectronHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    store: {
      // eslint-disable-next-line no-unused-vars
      get: (key: string) => any;
      // eslint-disable-next-line no-unused-vars
      set: (key: string, val: any) => void;
    };
  }
}

export {};
