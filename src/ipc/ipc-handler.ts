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
  ipcMain.handle(
    'asyncRequest',
    (
      event: IpcMainInvokeEvent,
      requestId: string,
      action: string,
      payload: unknown
    ) => {
      const response: ActionResponse<typeof payload> = {
        send: result => event.sender.send('asyncResponse', requestId, result),
        notify: message =>
          event.sender.send('asyncResponseNotify', requestId, message),
        error: err => event.sender.send('errorResponse', requestId, err),
      };

      const requestedAction = actions[action];

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
