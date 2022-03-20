import { Bridge } from 'ipc/ipc-handler';
import { spawn, IPty } from 'node-pty';

const processes: { [key: string]: IPty } = {};

const executeTerminalCommand: Bridge<
  { containerId: string; terminalId: string; command: string },
  { output: string }
> = async ({ containerId, terminalId, command }, channel) => {
  try {
    let pty = processes[terminalId];

    if (command === 'exit') {
      pty.kill();
      delete processes[terminalId];
      return;
    }

    if (!pty) {
      const shellCmd = `bash`;
      pty = spawn(shellCmd, ['-c', `docker exec -it ${containerId} /bin/bash`], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
      });
      processes[terminalId] = pty;
      // pty.write(`docker exec -it ${containerId} /bin/bash\r`);
      pty.onData(output => {
        console.log(`pty: `, output);
        channel.reply({ output });
      });
    }
    pty.write(command);
  } catch (error) {
    channel.error(error);
  }
};

const killTerminals: Bridge<void, void> = (_, channel) => {
  Object.keys(processes).forEach(k => {
    processes[k].kill();
    delete processes[k];
  });
  channel.reply();
};

export default {
  'terminal:execute': executeTerminalCommand,
  'terminal:kill': killTerminals,
};
