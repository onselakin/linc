/* eslint-disable @typescript-eslint/no-explicit-any */

let pendingInvocations: { [key: string]: any } = {};

const removePendingInvocation = (invocationId: string) => {
  pendingInvocations = Object.keys(pendingInvocations)
    .filter(k => k !== invocationId)
    .map(k => ({ [k]: pendingInvocations[k] }))
    .reduce((accumulator, current) => ({ ...accumulator, ...current }), {});
};

export class Deferred<T> {
  resolve!: (value: T) => void;

  reject!: (reason: any) => void;

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

const InvokeChannel = <ReplyType, Notification = void>(
  channelName: string,
  payload?: any,
  notifier?: (notification: Notification) => void
): Promise<ReplyType> => {
  const invocationId = Math.random().toString(36).slice(-5);

  const deferred = new Deferred<ReplyType>();
  pendingInvocations[invocationId] = { deferred, channelName, payload, notifier };
  window.electron.ipcRenderer.send('asyncRequest', invocationId, channelName, payload);
  return deferred.promise;
};

const SetupRendererProcessListener = () => {
  window.electron.ipcRenderer.on('asyncResponseNotify', ([invocationId, channel]) => {
    const { notifier } = pendingInvocations[invocationId];
    if (notifier) notifier(channel);
  });

  window.electron.ipcRenderer.on('asyncResponse', ([invocationId, channel]) => {
    const { deferred } = pendingInvocations[invocationId];
    removePendingInvocation(invocationId);
    deferred.resolve(channel);
  });

  window.electron.ipcRenderer.on('errorResponse', ([invocationId, err]) => {
    const { deferred } = pendingInvocations[invocationId];
    removePendingInvocation(invocationId);
    deferred.reject(err);
  });
};

export { InvokeChannel, SetupRendererProcessListener };
