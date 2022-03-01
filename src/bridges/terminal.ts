import { Bridge } from 'ipc/ipc-handler';
import { spawn, IPty } from 'node-pty';
import { platform } from 'os';

const shell = platform() === 'win32' ? 'powershell.exe' : 'bash';
const processes: { [key: string]: IPty } = {};

const executeTerminalCommand: Bridge<{ terminalId: string; command: string }, { output: string }> = async (
  { terminalId, command },
  channel
) => {
  try {
    let pty = processes[terminalId];
    if (!pty) {
      pty = spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
      });
      pty.onData(output => {
        channel.reply({ output });
      });
    }
    processes[terminalId] = pty;
    pty.write(command);
  } catch (error) {
    channel.error(error);
  }
};

export default {
  'terminal-execute': executeTerminalCommand,
};
