import {TerminalCommand, TerminalCommandExecute} from '@/commands/types';

export const command: TerminalCommand['command'] = /exit.*/g;
export const adminCommand: TerminalCommand['adminCommand'] = /sudo exit.*/g;

export const execute: TerminalCommandExecute<
    {}, {}, {closeApplication: () => void}
> = (
    _g, _a, _f, _l,
    {closeApplication}
) => closeApplication();