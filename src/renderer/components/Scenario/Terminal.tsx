import 'renderer/App.css';

import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

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
      term.write(`Hello from \x1B[1;3;31mxterm.js\x1B[0m $ `);
    }
  }, []);

  useEffect(() => {
    fit.current?.fit();
  }, [value]);

  return <div className="h-full bg-black p-2" ref={xtermContainer} />;
};

export default Term;
