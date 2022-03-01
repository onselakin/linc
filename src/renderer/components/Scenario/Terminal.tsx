import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { CreateChannel } from '../../../ipc/ipc-emitter';

const Term = ({ value }: { value: number }) => {
  const fit = useRef<FitAddon | null>(null);
  const xtermContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (xtermContainer.current !== null) {
      const term = new Terminal({ cols: 80, rows: 25, fontFamily: 'Ubuntu Mono', fontSize: 16 });
      const fitAddon = new FitAddon();
      fit.current = fitAddon;
      term.loadAddon(fitAddon);
      term.open(xtermContainer.current);
      fitAddon.fit();

      const channel = CreateChannel('terminal-execute');
      // eslint-disable-next-line @typescript-eslint/no-shadow
      channel.onReply = ({ output }) => {
        term.write(output);
      };
      channel.send({ terminalId: '1', command: '' });
      term.onData(data => {
        channel.send({ terminalId: '1', command: data });
      });
    }
  }, []);

  useEffect(() => {
    fit.current?.fit();
  }, [value]);

  return <div className="h-full bg-black p-2" ref={xtermContainer} />;
};

export default Term;
