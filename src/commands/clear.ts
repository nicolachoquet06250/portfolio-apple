import type {Setter, TerminalCommandExecute} from '@/commands/types';

export const command = /^clear$/g;
export const adminCommand = /^sudo clear$/g;

type Props = {}
type Flags = {}

type Setters = {
    result: Setter<string[]>,
    command: Setter<string>,
    terminalHistory: Setter<string[]>
}

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    _groups, _isAdmin, _flags, _location,
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