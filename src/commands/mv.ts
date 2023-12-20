import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import finder, {realpath} from '@/hooks/finder';

export const command: TerminalCommand['command'] =
    /^mv( ?(?<flags>-[a-zA-Z0-9\-_=.\/]+) ?)?( ?((?<from>[a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+') (?<to>[a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')))?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo mv( ?(?<flags>-[a-zA-Z0-9\-_=.\/]+) ?)?( ?((?<from>[a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+') (?<to>[a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')))?$/g;

export const usage: TerminalCommand['usage'] = 'mv SOURCE DEST'
export const description: TerminalCommand['description'] = 'Renommer SOURCE en DEST, ou déplacer le ou les SOURCEs vers RÉPERTOIRE.';

export const flags: TerminalCommand['flags'] = [
    {
        long: 'force',
        short: 'f',
        type: Boolean,
        description: `ne pas demander de confirmation avant d'écraser`
    }
]

type Props = {
    from: string,
    to: string
}
type Flags = {
    force: boolean
}

const {isPathExists, useTreeActions} = finder();

export const execute: TerminalCommandExecute<Props, Flags> = (
    {from, to},
    _,
    {force}
) => {
    const {move} = useTreeActions();

    if (from && to) {
        if (
            (
                // déplace un fichier dans un répertoire
                (from.includes('.') && !to.includes('.')) ||
                // renomme || déplace un fichier dans un répertoire
                (from.includes('.') && to.includes('.')) ||
                // déplace le répertoire source dans le répertoire de destination
                (!from.includes('.') && !to.includes('.') && isPathExists(realpath(to))) ||
                // renomme le répertoire source en le répertoire de destination
                (!from.includes('.') && !to.includes('.') && force)
            ) && move(from, to)
        ) return [''];

        return `mv: ${from}: est un dossier`
    }

    return [
        'mv: operande de fichier manquant',
        `Saisissez << mv --help >> pour plus d'informations.`
    ];
}