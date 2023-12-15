import type {TerminalCommandExecute} from '@/commands/types.ts';
import finder, {realpath} from '@/hooks/finder';

export const command = /^ls ?(?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')?)$/g
export const adminCommand = /^sudo ls ?(?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')?)$/g;

type Props = {
    dist: string
};

const { getChildrenItems, isPathExists } = finder();

export const execute: TerminalCommandExecute<Props> = (
    {dist= ''},
    _isAdmin,
    location
) => {
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