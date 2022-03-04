import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { CreateChannel } from '../../ipc/ipc-emitter';

const Term = ({ value }: { value: number }) => {
  const fit = useRef<FitAddon>(new FitAddon());
  const xtermContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (xtermContainer.current !== null) {
      const terminalId = Math.random().toString(36).slice(-5);
      const term = new Terminal({ cols: 80, rows: 25, fontFamily: 'Ubuntu Mono', fontSize: 16 });
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
    }
  }, []);

  useEffect(() => {
    fit.current.fit();
  }, [value]);

  return <div className="h-full" ref={xtermContainer} />;
};

export default Term;
