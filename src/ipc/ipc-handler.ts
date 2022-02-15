/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpcMain, IpcMainInvokeEvent } from 'electron';

export interface ActionRequest<Payload = void> {
  payload: Payload;
}

export interface ActionResponse<Payload = void, Notification = void> {
  send: (response?: Payload) => void;
  notify: (data?: Notification) => void;
  error: (error: unknown) => void;
}

export interface Action<RequestPayload, ResponsePayload, Notification> {
  (
    request: RequestPayload,
    response: ActionResponse<ResponsePayload, Notification>
  ): void;
}

const SetupMainProcessHandler = <
  Actions extends Record<string, Action<any, any, any>>
>(
  ipcMain: IpcMain,
  actions: Actions
) => {
  ipcMain.on(
    'asyncRequest',
    (
      event: IpcMainInvokeEvent,
      [actionId, action, payload]: [string, string, any]
    ) => {
      const response: ActionResponse<typeof payload> = {
        send: result => event.sender.send('asyncResponse', actionId, result),
        notify: message =>
          event.sender.send('asyncResponseNotify', actionId, message),
        error: err => event.sender.send('errorResponse', actionId, err),
      };

      console.log(`Action called: ${action}`);
      console.log('--------------------');
      console.dir(payload);
      console.log('--------------------');

      const requestedAction = actions[action];

      if (!requestedAction) {
        response.error(new Error('Action not found.'));
      }

      try {
        requestedAction(payload, response);
      } catch (e) {
        if (typeof e === 'string') {
          response.error(new Error(e));
        } else if (e instanceof Error) {
          response.error(e);
        }
      }
    }
  );
};

export default SetupMainProcessHandler;
