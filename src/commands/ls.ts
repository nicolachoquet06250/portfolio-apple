import type {TerminalCommandExecute, TerminalCommandFlag} from '@/commands/types';
import finder, {realpath} from '@/hooks/finder';

export const command = /^ls ?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?(?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')?)$/g
export const adminCommand = /^sudo ls ?((?<flags>-[a-zA-Z0-9\-_=.\\\/ ]+) ?)?(?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')?)$/g;

export const flags: TerminalCommandFlag[] = [
    {
        long: 'help',
        short: 'h',
        type: Boolean
    }
];

type Props = {
    dist: string
};

type Flags = {
    help: boolean,
    test: string
}

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