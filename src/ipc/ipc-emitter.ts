/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpcRenderer } from 'electron';

let ipcRenderer: IpcRenderer;

let pendingActions: { [key: string]: any } = {};

const removePendingAction = (actionId: string) => {
  pendingActions = Object.keys(pendingActions)
    .filter(k => k !== actionId)
    .map(k => ({ [k]: pendingActions[k] }))
    .reduce((accumulator, current) => ({ ...accumulator, ...current }), {});
};

class Deferred<T> {
  resolve!: (value: T) => void;

  reject!: (value: T) => void;

  promise!: Promise<T>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const EmitAction = <Result, Notification>(
  action: string,
  payload: any,
  notifier: (notification: Notification) => void
): Promise<Result> => {
  const actionId = Math.random().toString(36).slice(-5);

  ipcRenderer.send('asynRequest', actionId, payload);
  const deferred = new Deferred<Result>();
  pendingActions[actionId] = { deferred, action, payload, notifier };
  return deferred.promise;
};

const SetupRendererProcessListener = (electronIpcRenderer: IpcRenderer) => {
  console.log(electronIpcRenderer);
  ipcRenderer = electronIpcRenderer;

  ipcRenderer.on('asyncResponseNotify', (_event, actionId, res) => {
    const { notifier } = pendingActions[actionId];
    notifier(res);
  });

  ipcRenderer.on('asyncResponse', (_event, actionId, res) => {
    const { deferred } = pendingActions[actionId];
    removePendingAction(actionId);
    deferred.resolve(res);
  });

  ipcRenderer.on('errorResponse', (_event, actionId, err) => {
    const { deferred } = pendingActions[actionId];
    removePendingAction(actionId);
    deferred.reject(err);
  });
};

export { EmitAction, SetupRendererProcessListener };
