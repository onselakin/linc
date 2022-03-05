import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { CreateChannel } from '../../ipc/ipc-emitter';

interface TerminalProps {
  size: number;
  visible: boolean;
}

export interface TerminalRef {
  exit: () => void;
  fit: () => void;
}

const createTerminal = () => {
  console.log('Creating a terminal');
  return new Terminal({ cols: 80, rows: 25, fontFamily: 'Ubuntu Mono', fontSize: 16 });
};

const Term = forwardRef<TerminalRef, TerminalProps>(({ size, visible }, ref) => {
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
      const terminalId = Math.random().toString(36).slice(-5);
      const term = createTerminal();
      term.loadAddon(fit.current);
      term.open(xtermContainer.current);
      fit.current.fit();

      const channel = CreateChannel('terminal-execute');
      // eslint-disable-next-line @typescript-eslint/no-shadow
      channel.onReply = ({ output }) => {
        term.write(output);
      };
      channel.send({ terminalId, command: '' });
      term.onData(data => {
        channel.send({ terminalId, command: data });
      });
      exitCallRef.current = () => {
        channel.send({ terminalId, command: 'exit' });
      };
    }
  }, []);

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
