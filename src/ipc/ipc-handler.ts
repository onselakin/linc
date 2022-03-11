/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpcMain, IpcMainInvokeEvent } from 'electron';

export interface ChannelRequest<Payload = void> {
  payload: Payload;
}

export interface Channel<ReplyPayload = void, NotificationPayload = void> {
  reply: (payload?: ReplyPayload) => void;
  notify: (payload?: NotificationPayload) => void;
  error: (error: unknown) => void;
}

export interface Bridge<RequestPayload, ResponsePayload, NotificationPayload = void> {
  (payload: RequestPayload, channel: Channel<ResponsePayload, NotificationPayload>): void;
}

const SetupMainProcessHandler = <Bridges extends Record<string, Bridge<any, any, any>>>(
  ipcMain: IpcMain,
  bridges: Bridges
) => {
  ipcMain.on(
    'asyncRequest',
    (event: IpcMainInvokeEvent, [invocationId, channelName, payload]: [string, string, any]) => {
      const channel: Channel = {
        reply: result => event.sender.send('asyncResponse', invocationId, result),
        notify: message => event.sender.send('asyncResponseNotify', invocationId, message),
        error: err => event.sender.send('errorResponse', invocationId, err),
      };

      const requestedChannel = bridges[channelName];

      if (!requestedChannel) {
        channel.error(new Error('Channel not found.'));
      }

      requestedChannel(payload, channel);
    }
  );
};

export default SetupMainProcessHandler;
