import type {Setter, TerminalCommandExecute} from '@/commands/types';
import finder from '@/hooks/finder';

export const command = /^cd (?<dist>[a-zA-Z0-9_\-\/]+)$/g;
export const adminCommand = /^sudo cd (?<dist>[a-zA-Z0-9_\-\/]+)$/g;

type Props = {
    dist: string
}

type Setters = {
    location: Setter<string>
}

const { getChildrenItems, isPathExists } = finder();

export const execute: TerminalCommandExecute<Props, Setters> = (
    {dist},
    _isAdmin,
    location,
    {location: setLocation}
) => {
    // @TODO implementer les retours arrière '../'
    // @TODO Fixer la partie chemins absoluts
    /*if (dist.startsWith('/')) {
        if (isPathExists(dist.replace('//', '/'))) {
            setLocation(dist.replace('//', '/'));
            console.log(getChildrenItems()('', location.value))
            return [``];
        }

        return `cd: ${dist}: Aucun fichier ou dossier de ce type`
    } else {*/
        if (isPathExists((location.value + '/' + dist).replace('//', '/'))) {
            setLocation(l => (l + '/' + dist).replace('//', '/'));
            console.log(getChildrenItems()('', location.value))
            return [``];
        }

        return `cd: ${dist}: Aucun fichier ou dossier de ce type`
    /*}*/
}