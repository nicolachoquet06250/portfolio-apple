import type {Setter, TerminalCommandExecute} from '@/commands/types';
import finder from '@/hooks/finder';

export const command = /^cd (?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+'))$/g;
export const adminCommand = /^sudo cd (?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+'))$/g;

type Props = {
    dist: string
}

type Setters = {
    location: Setter<string>
}

const { getChildrenItems, isPathExists } = finder();

type RealPath = (path: string) => string;

const realpath: RealPath = path => {
    const p = path.split('/');
    if ([...p].pop() === '') p.pop();
    if ([...p].shift() === '') p.shift();

    if (path.includes('..')) {

        const newP: string[] = [];
        for (const it of p) {
            if (it === '..') {
                if (p.length > 0) {
                    newP.pop();
                }
            }
            else {
                newP.push(it)
            }
        }

        return '/' + newP.join('/');
    }

    return '/' + p.join('/');
};

export const execute: TerminalCommandExecute<Props, Setters> = (
    {dist},
    _isAdmin,
    location,
    {location: setLocation}
) => {
    if (dist.startsWith('\'')) dist = dist.substring(1);
    if (dist.endsWith('\'')) dist = dist.substring(0, dist.length - 1);

    if (dist.startsWith('/')) {
        if (isPathExists(realpath(dist.replace('//', '/')))) {
            setLocation(realpath(dist.replace('//', '/')));
            console.log(getChildrenItems()('', location.value))
            return [``];
        }

        return `cd: ${dist}: Aucun fichier ou dossier de ce type`
    }
    else {
        if (
            isPathExists(
                realpath(
                    (location.value + '/' + dist)
                        .replace('//', '/')
                )
            )
        ) {
            setLocation(l =>
                realpath(
                    (l + '/' + dist)
                        .replace('//', '/')
                )
            );
            console.log(getChildrenItems()('', location.value))
            return [``];
        }

        return `cd: ${dist}: Aucun fichier ou dossier de ce type`
    }
}