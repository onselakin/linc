/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

  const deferred = new Deferred<Result>();
  pendingActions[actionId] = { deferred, action, payload, notifier };
  window.electron.ipcRenderer.send('asyncRequest', actionId, action, payload);
  return deferred.promise;
};

const SetupRendererProcessListener = () => {
  window.electron.ipcRenderer.on('asyncResponseNotify', ([actionId, res]) => {
    console.log(pendingActions);
    const { notifier } = pendingActions[actionId];
    notifier(res);
  });

  window.electron.ipcRenderer.on('asyncResponse', ([actionId, res]) => {
    const { deferred } = pendingActions[actionId];
    removePendingAction(actionId);
    deferred.resolve(res);
  });

  window.electron.ipcRenderer.on('errorResponse', ([actionId, err]) => {
    const { deferred } = pendingActions[actionId];
    removePendingAction(actionId);
    deferred.reject(err);
  });
};

export { EmitAction, SetupRendererProcessListener };
