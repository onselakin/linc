/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { Channel } from './ipc-handler';
import type actions from '../bridges';
import randomId from '../utils/randomId';

let pendingInvocations: { [key: string]: any } = {};

const removePendingInvocation = (invocationId: string) => {
  pendingInvocations = Object.keys(pendingInvocations)
    .filter(k => k !== invocationId)
    .map(k => ({ [k]: pendingInvocations[k] }))
    .reduce((accumulator, current) => ({ ...accumulator, ...current }), {});
};

export class IpcChannel<RequestPayload, ResponsePayload> {
  constructor(public invocationId: string, public channelName: string) {}

  onReply: ((payload: ResponsePayload) => void) | undefined;

  send(payload: RequestPayload) {
    window.electron.ipc.send('asyncRequest', this.invocationId, this.channelName, payload);
  }
}

export class Deferred<T> {
  resolve!: (value: T) => void;

  reject!: (reason: any) => void;

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

const InvokeChannel = <
  ChannelName extends keyof typeof actions,
  Payload extends Parameters<typeof actions[ChannelName]>[0]
>(
  channelName: ChannelName,
  payload?: Payload,
  notifier?: (payload: Parameters<typeof actions[ChannelName]>[1] extends Channel<any, infer T> ? T : null) => void
): Promise<Parameters<typeof actions[ChannelName]>[1] extends Channel<infer T, any> ? T : null> => {
  const invocationId = randomId();
  const deferred = new Deferred<any>();
  pendingInvocations[invocationId] = { deferred, channelName, payload, notifier };
  window.electron.ipc.send('asyncRequest', invocationId, channelName, payload);
  return deferred.promise;
};

const CreateChannel = <
  ChannelName extends keyof typeof actions,
  RequestPayload extends Parameters<typeof actions[ChannelName]>[0],
  ResponsePayload extends Parameters<typeof actions[ChannelName]>[1] extends Channel<infer T, any> ? T : null
>(
  channelName: ChannelName
): IpcChannel<RequestPayload, ResponsePayload> => {
  const invocationId = randomId();
  const ipcChannel = new IpcChannel<RequestPayload, ResponsePayload>(invocationId, channelName);
  pendingInvocations[invocationId] = { ipcChannel };
  return ipcChannel;
};

const SetupRendererProcessListener = () => {
  window.electron.ipc.on('asyncResponseNotify', ([invocationId, payload]) => {
    const { notifier } = pendingInvocations[invocationId];
    if (notifier) notifier(payload);
  });

  window.electron.ipc.on('asyncResponse', ([invocationId, payload]) => {
    if (pendingInvocations[invocationId] === undefined) return;

    const { ipcChannel, deferred } = pendingInvocations[invocationId];
    if (ipcChannel) {
      ipcChannel.onReply(payload);
    } else {
      removePendingInvocation(invocationId);
      deferred.resolve(payload);
    }
  });

  window.electron.ipc.on('errorResponse', ([invocationId, err]) => {
    const { deferred } = pendingInvocations[invocationId];
    removePendingInvocation(invocationId);
    deferred.reject(err);
  });
};

export { InvokeChannel, CreateChannel, SetupRendererProcessListener };
