import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {generateHelp} from '@/hooks/terminal/commands';
import * as $commands from '@/commands';

export const command: TerminalCommand['command'] =
    /^compgen ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo compgen ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?$/g;

export const usage: TerminalCommand['usage'] = 'compgen [-c]';
export const description: TerminalCommand['description'] =
    `Affiche les possibilités de complètement dépendant des options.
    
    Ceci est destiné à être utilisé depuis une fonction de shell générant
    des auto-complètements possibles. Si le MOT optionnel est fourni,
    des correspondances avec « MOT » sont générées.
    
    Code de sortie :
    Renvoie le code de succès à moins qu'une option non valable ne soit
    fournie ou qu'une erreur ne survienne.`;
export const flags: TerminalCommand['flags'] = [
    {
        short: 'c',
        type: Boolean,
        description: 'will list all the commands you could run'
    }
];

export const help = () => generateHelp(usage, flags, description);

type  Props = {};
type  Flags = {
    c: boolean
};
type  Setters = {};

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    _groups, _isAdmin,
    {c: showCommands}, _location,
    _setters
) => {
    if (showCommands) {
        return Object.entries($commands as unknown as Record<string, TerminalCommand>)
            .map(([preName, command]) =>
                command.name ?? preName)
    }
    return ['']
}