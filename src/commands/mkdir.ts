import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {generateHelp, preg_match} from '@/hooks/terminal/commands';
import finder, {realpath} from '@/hooks/finder';

export const command: TerminalCommand['command'] =
    /^mkdir( ?(?<flags>-[a-zA-Z0-9\-_=.\/]+) ?)?(?<directories>[a-zA-Z0-9_'\/ ]+)?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo mkdir( ?(?<flags>-[a-zA-Z0-9\-_=.\/]+) ?)?(?<directories>[a-zA-Z0-9_'\/ ]+)?$/g;
export const usage = `mkdir [-p | --parent] RÉPERTOIRE...`;
export const description: TerminalCommand['description'] =
    `Créer le ou les RÉPERTOIREs s'ils n'existent pas.`;
export const flags: TerminalCommand['flags'] = [
    {
        long: 'parent',
        short: 'p',
        type: Boolean,
        description: `créer les répertoires parents nécessaires, sans erreur s'ils existent`
    }
];

export const help: TerminalCommand['help'] = () => generateHelp(usage, flags, description);

type Props = {
    directories: string
};
type Flags = {
    parent: boolean
};

const {isPathExists, useTreeActions} = finder();

export const execute: TerminalCommandExecute<Props, Flags> = (
    {directories},
    _isAdmin,
    {parent}
) => {
    const {add} = useTreeActions();

    if (directories) {
        const dirMatches =
            preg_match(/([a-zA-Z0-9_\/]+|'[a-zA-Z0-9_\/ ]*')/g, directories);

        if (dirMatches !== null && dirMatches instanceof Array && dirMatches.length > 0) {
            const formattedDirMatches = [...dirMatches]
                .map(dir =>
                    dir.includes(' ') &&
                    dir.startsWith(`'`) &&
                    dir.endsWith(`'`) ?
                        dir.substring(1, dir.length - 1) :
                        dir
                );

            for (let dir of formattedDirMatches) {
                dir = realpath(dir);

                const dirPath = dir.split('/');
                const dirName = dirPath.pop()!;
                if (!isPathExists(dir)) {
                    if (!isPathExists((dirPath.join('/') === '' ? '/' : dirPath.join('/')))) {
                        if (!parent) {
                            return `mkdir: ${(dirPath.join('/') === '' ? '/' : dirPath.join('/'))}: Aucun fichier ou dossier de ce type`
                        }
                        else {
                            dirPath.reduce((r, c) => {
                                const path = realpath(`${r}/${c}`);

                                if (!isPathExists(path)) {
                                    const splitPath = path.split('/');
                                    const dirName = splitPath.pop()!;
                                    add((splitPath.join('/') === '' ? '/' : splitPath.join('/')), dirName);
                                }

                                return path;
                            }, '')
                        }
                    }

                    add((dirPath.join('/') === '' ? '/' : dirPath.join('/')), dirName);
                }
            }
        }

        return [''];
    }
    else {
        return [
            'mkdir: operande de fichier manquant',
            `Saisissez << mkdir --help >> pour plus d'informations.`
        ]
    }
};