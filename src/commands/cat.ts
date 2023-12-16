import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types.ts';
import {generateHelp} from '@/hooks/terminal/commands.ts';
import {isPathExists} from '@/hooks/finder/finder';

export const command: TerminalCommand['command'] =
    /^cat ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?(?<file>([./a-zA-Z][a-zA-Z0-9-_/.]+)|'([./a-zA-Z][a-zA-Z0-9-_/. ]+)')?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo cat ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?(?<file>([./a-zA-Z][a-zA-Z0-9-_/.]+)|'([./a-zA-Z][a-zA-Z0-9-_/. ]+)')?$/g;

export const usage: TerminalCommand['usage'] = 'cat [OPTION]... [FICHIER]...';
export const description: TerminalCommand['description'] =
    'Concaténer les FICHIERs vers la sortie standard';
export const flags: TerminalCommand['flags'] = [
    {
        long: 'number-nonblank',
        short: 'b',
        type: Boolean,
        description: 'numéroter les lignes non vides en sortie, annule -n'
    },
    {
        long: 'show-ends',
        short: 'E',
        type: Boolean,
        description: 'afficher $ à la fin de chaque ligne'
    },
    {
        long: 'number',
        short: 'n',
        type: Boolean,
        description: 'numéroter toutes les lignes en sortie'
    },
    {
        long: 'squeeze-blank',
        short: 's',
        type: Boolean,
        description: 'supprimer les lignes vides qui se répètent en sortie'
    },
    {
        long: 'show-tabs',
        short: 'T',
        type: Boolean,
        description: 'afficher les caractères TAB comme ^I'
    }
];

export const help = () => generateHelp(usage, flags, description);

type Props = {
    file: string
};
type Flags = {};
type Setters = {};

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    { file }, _isAdmin,
    _flags, _location,
    _setters
) => {
    file.startsWith('\'') &&
    file.startsWith('\'') &&
    file.includes(' ') &&
    (file = file.substring(1, file.length - 1));

    if (!isPathExists(file)) {
        return `cat: ${file}: Aucun fichier ou dossier de ce type`
    }

    return file;
}