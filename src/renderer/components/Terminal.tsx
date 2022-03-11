import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { CreateChannel } from '../../ipc/ipc-emitter';

interface TerminalProps {
  size: number;
  visible: boolean;
  containerId: string;
  terminalId: string;
}

export interface TerminalRef {
  exit: () => void;
  fit: () => void;
}

const createTerminal = () => {
  return new Terminal({ cols: 80, rows: 25, fontFamily: 'Ubuntu Mono', fontSize: 16 });
};

const Term = forwardRef<TerminalRef, TerminalProps>(({ size, visible, containerId, terminalId }, ref) => {
  const exitCallRef = useRef<() => void>();
  const fit = useRef<FitAddon>(new FitAddon());
  const xtermContainer = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    exit() {
      exitCallRef.current?.();
    },
    fit() {
      fit.current.fit();
    },
  }));

  useEffect(() => {
    if (xtermContainer.current !== null) {
      const term = createTerminal();
      term.loadAddon(fit.current);
      term.open(xtermContainer.current);
      fit.current.fit();

      const channel = CreateChannel('terminal-execute');
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
    }
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
