import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { CreateChannel } from 'ipc/ipc-emitter';
import log from 'utils/logger';

interface TerminalProps {
  size: number;
  visible: boolean;
  containerId: string;
  terminalId: string;
}

export interface TerminalRef {
  exit: () => void;
  fit: () => void;
  execute: (command: string) => void;
}

const Term = forwardRef<TerminalRef, TerminalProps>(({ size, visible, containerId, terminalId }, ref) => {
  log(`Terminal Created: ${terminalId}`, 'color: magenta');
  const exitCallRef = useRef<() => void>();
  const executeCallRef = useRef<(command: string) => void>();
  const fit = useRef<FitAddon>(new FitAddon());
  const terminal = useRef<Terminal>();
  const xtermContainer = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    exit() {
      log(`Terminal ${terminalId} exited.`);
      exitCallRef.current?.();
    },
    fit() {
      fit.current.fit();
    },
    execute(command: string) {
      executeCallRef.current?.(command);
    },
  }));

  useEffect(() => {
    log(`Terminal useEffect: ${terminalId}`, 'color: magenta');
    const term = new Terminal({ cols: 80, rows: 25, fontFamily: 'Ubuntu Mono', fontSize: 16 });

    if (xtermContainer.current !== null) {
      terminal.current = term;
      term.loadAddon(fit.current);
      term.open(xtermContainer.current);
      fit.current.fit();

      const channel = CreateChannel('terminal:execute');
      channel.onReply = ({ output }) => {
        term.write(output);
      };
      channel.send({ containerId, terminalId, command: '' });
      term.onData(data => {
        channel.send({ containerId, terminalId, command: data });
      });
      exitCallRef.current = () => {
        channel.send({ containerId, terminalId, command: 'exit' });
      };
      executeCallRef.current = (command: string) => {
        channel.send({ containerId, terminalId, command });
      };
    }

    return function () {
      term.dispose();
    };
  }, [containerId, terminalId]);

  useEffect(() => {
    fit.current.fit();
  }, [size]);

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 left-0 ${visible ? 'visible' : 'invisible'}`}
      ref={xtermContainer}
    />
  );
});

export default Term;
