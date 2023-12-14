import type {TerminalCommandExecute} from '@/commands/types';

export const command = /^cd (?<dist>[a-zA-Z0-9_\-\/]+)$/g;
export const adminCommand = /^sudo cd (?<dist>[a-zA-Z0-9_\-\/]+)$/g;

type Props = {
    dist: string
}

export const execute: TerminalCommandExecute<Props> = (
    {dist},
    isAdmin,
    {command: setCommand}
) => {
    setCommand('');
    return `direction ${dist}${isAdmin ? ' en mode admin' : ''}`;
}