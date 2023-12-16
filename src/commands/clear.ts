import type {Setter, TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {generateHelp} from '@/hooks/terminal/commands';

export const command: TerminalCommand['command'] =
    /^clear ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo clear ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?$/g;

export const usage: TerminalCommand['usage'] = 'clear [options]';
export const flags: TerminalCommand['flags'] = [
    {
        long: 'TERM',
        short: 'T',
        type: Boolean,
        description: 'use this instead of $TERM'
    },
    {
        short: 'V',
        type: Boolean,
        description: 'print curses-version'
    },
    {
        short: 'x',
        type: Boolean,
        description: 'do not try to clear scrollback'
    },
]

type Props = {}
type Flags = {
    help: boolean,
    TERM: boolean,
    V: boolean,
    x: boolean
}
type Setters = {
    result: Setter<string[]>,
    command: Setter<string>,
    terminalHistory: Setter<string[]>
}

export const help: TerminalCommand['help'] = () => generateHelp(usage, flags);

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    _groups, _isAdmin, _flags, _location,
    {result, command, terminalHistory}
) => {
    result([]);
    command('');
    terminalHistory([]);
}