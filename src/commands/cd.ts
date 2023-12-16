import type {Setter, TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import finder, {realpath} from '@/hooks/finder';

export const command: TerminalCommand['command'] =
    /^cd (?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+'))$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo cd (?<dist>([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+'))$/g;

type Props = {
    dist: string
}
type Setters = {
    location: Setter<string>
}
type Flags = {};

const { isPathExists } = finder();

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    {dist},
    _isAdmin,
    _flags,
    location,
    {location: setLocation}
) => {
    if (dist.startsWith('\'')) dist = dist.substring(1);
    if (dist.endsWith('\'')) dist = dist.substring(0, dist.length - 1);

    if (dist.startsWith('/')) {
        if (isPathExists(realpath(dist.replace('//', '/')))) {
            setLocation(realpath(dist.replace('//', '/')));
            return [``];
        }

        return `cd: ${dist}: Aucun fichier ou dossier de ce type`
    }
    else {
        if (dist === '.') return [``];

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
            return [``];
        }

        return `cd: ${dist}: Aucun fichier ou dossier de ce type`
    }
}