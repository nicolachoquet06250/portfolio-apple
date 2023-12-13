import type {TerminalCommandExecute} from '@/commands/types';

export const command = /^clear$/g;
export const adminCommand = /^sudo clear$/g;

export const execute: TerminalCommandExecute = (
    _, __,
    setResult,
    setCommand
) => {
    setResult([]);
    setCommand('');
    return '';
}