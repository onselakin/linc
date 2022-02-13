/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpcMain, IpcMainInvokeEvent } from 'electron';

export interface ActionError {
  message: string;
}

export interface ActionRequest<Payload> {
  payload: Payload;
}

export interface ActionResponse<Payload> {
  send: (response?: Payload) => void;
  notify: (response?: Payload) => void;
  error: (error?: ActionError) => void;
}

export interface Action<RequestPayload, ResponsePayload> {
  (
    request: ActionRequest<RequestPayload>,
    response: ActionResponse<ResponsePayload>
  ): void;
}

const SetupMainProcessHandler = <
  Actions extends Record<string, Action<any, any>>
>(
  ipcMain: IpcMain,
  actions: Actions
) => {
  Object.keys(actions).forEach(k => console.log(k));

  ipcMain.on(
    'asyncRequest',
    (
      event: IpcMainInvokeEvent,
      [actionId, action, payload]: [string, string, any]
    ) => {
      console.log('[Ipc Handler] Action Id: ', actionId);
      console.log('[Ipc Handler] Action: ', action);
      console.log('[Ipc Handler] Payload: ', payload);

      const response: ActionResponse<typeof payload> = {
        send: result => event.sender.send('asyncResponse', actionId, result),
        notify: message =>
          event.sender.send('asyncResponseNotify', actionId, message),
        error: err => event.sender.send('errorResponse', actionId, err),
      };

      const requestedAction = actions[action];
      console.log(actions[action]);

      if (!requestedAction) {
        response.error({ message: 'Action not found.' });
      }

      try {
        requestedAction({ payload }, response);
      } catch (e) {
        const error: ActionError = { message: ' ' };
        if (typeof e === 'string') {
          error.message = e.toUpperCase();
        } else if (e instanceof Error) {
          error.message = e.message;
        }
        response.error(error);
      }
    }
  );
};

export default SetupMainProcessHandler;
