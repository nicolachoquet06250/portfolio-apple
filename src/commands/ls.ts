import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import finder, {realpath} from '@/hooks/finder';
import {generateHelp} from '@/hooks/terminal/commands.ts';

export const command: TerminalCommand['command'] =
    /^ls ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?(?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')?)$/g
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo ls ?((?<flags>-[a-zA-Z0-9\-_=.\\\/ ]+) ?)?(?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')?)$/g;

export const description: TerminalCommand['description'] =
    `Afficher des renseignements sur les FICHIERs (du répertoire actuel par défaut).
Trier les entrées alphabétiquement si aucune des options -cftuvSUX ou --sort
ne sont utilisées.`
export const usage: TerminalCommand['usage'] = 'ls [OPTION]... [FICHIER]...';
export const flags: TerminalCommand['flags'] = [
    {
        long: 'all',
        short: 'a',
        type: Boolean,
        description: 'ne pas ignorer les entrés débutant par .'
    },
    {
        long: 'almost-all',
        short: 'A',
        type: Boolean,
        description: 'ne pas inclure . ou .. dans la liste'
    },
    {
        long: 'author',
        short: 'l',
        type: Boolean,
        description: 'affiche l\'auteur de chaque fichier'
    },
    {
        long: 'ignore-backup',
        short: 'B',
        type: Boolean,
        description: 'ne pas inclure les entrées se terminant par ~ dans la liste'
    },
    {
        long: 'reverse',
        short: 'r',
        type: Boolean,
        description: 'inverse l\'ordre de tri'
    },
];

type Props = {
    dist: string
};

type Flags = {
    help: boolean,
    all: boolean,
    'almost-all': boolean,
    author: boolean,
    'ignore-backup': boolean,
    reverse: boolean,
}

export const help: TerminalCommand['help'] = () => generateHelp(usage, flags, description)

const { getChildrenItems, isPathExists } = finder();

export const execute: TerminalCommandExecute<Props, Flags> = (
    {dist= ''},
    _isAdmin,
    {help = false},
    location
) => {
    if (help) {
        return 'help ls'
    }

    if (dist.startsWith('\'')) dist = dist.substring(1);
    if (dist.endsWith('\'')) dist = dist.substring(0, dist.length - 1);

    if (dist.startsWith('/')) {
        if (isPathExists(realpath(dist.replace('//', '/')))) {
            const children = getChildrenItems()('',
                realpath(
                    dist
                        .replace('//', '/')
                )
            ).map(it => it.name);

            return [
                ...(children.length > 0
                    ? children : [''])
            ];
        }

        return `ls: ${dist}: Aucun fichier ou dossier de ce type`
    }
    else {
        if (dist === '.') {
            const children = getChildrenItems()('',
                location.value
                    .replace('//', '/')
            ).map(it => it.name);

            return [
                ...(children.length > 0
                    ? children : [''])
            ];
        }

        if (
            isPathExists(
                realpath(
                    (location.value + '/' + dist)
                        .replace('//', '/')
                )
            )
        ) {
            const children = getChildrenItems()('', realpath(
                (location.value + '/' + dist)
                    .replace('//', '/')
            )).map(it => it.name);

            return [
                ...(children.length > 0
                    ? children : [''])
            ];
        }

        return `ls: ${dist}: Aucun fichier ou dossier de ce type`
    }
}