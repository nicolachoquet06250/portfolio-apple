import type {Setter, TerminalCommandExecute} from '@/commands/types';

export const command = /^clear$/g;
export const adminCommand = /^sudo clear$/g;

type Setters = {
    result: Setter<string[]>,
    command: Setter<string>,
    terminalHistory: Setter<string[]>
}

export const execute: TerminalCommandExecute<{}, Setters> = (
    _, __, ___,
    {
        result: setResult,
        command: setCommand,
        terminalHistory: setTerminalHistory
    }
) => {
    setResult([]);
    setCommand('');
    setTerminalHistory([]);
}