import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {generateHelp} from '@/hooks/terminal/commands';

export const command: TerminalCommand['command'] =
    /^(\$\(pwd\)|pwd) ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo (\$\(pwd\)|pwd) ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?$/g;

export const usage: TerminalCommand['usage'] = 'help [-LP]';
export const description: TerminalCommand['description'] =
    'Affiche le nom du répertoire de travail courrent';

export const flags: TerminalCommand['flags'] = [
    {
        short: 'L',
        type: Boolean,
        description: 'affiche la valeur de $PWD s\'il nomme le répertoire courant'
    },
    {
        short: 'P',
        type: Boolean,
        description: 'affiche le répertoire physique sans aucun lien symbolique'
    },
];

export const help: TerminalCommand['help'] = () => generateHelp(usage, flags, description);

type Props = {};
type Flags = {
    L: boolean,
    P: boolean
};
type Setters = {};

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    _groups, _isAdmin, { L: _L = false, P: _P = false },
    _location, _setters
) => _location.value;