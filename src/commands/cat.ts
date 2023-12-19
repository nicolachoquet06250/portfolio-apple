import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {generateHelp} from '@/hooks/terminal/commands';
import finder, {realpath} from '@/hooks/finder';

export const command: TerminalCommand['command'] =
    /^cat ?((?<input_files>[a-zA-Z0-9-\/_.' ]+)?(?<operator> ?> ?))?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?(?<file>([.a-zA-Z][a-zA-Z0-9-_\/.]+)|'([.a-zA-Z][a-zA-Z0-9-_\/. ]+)')?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo cat ?((?<input_files>[a-zA-Z0-9-\/_.' ]+)?(?<operator> ?> ?))?((?<flags>-[a-zA-Z0-9\-_=.\\\/' ]+) ?)?(?<file>([.a-zA-Z][a-zA-Z0-9-_\/.]+)|'([.a-zA-Z][a-zA-Z0-9-_\/. ]+)')?$/g;

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
    file: string,
    operator?: string,
    input_files?: string
};
type Flags = {};
type Setters = {};

const {isPathExists, useTreeActions} = finder();

export const execute: TerminalCommandExecute<Props, Flags, Setters> = ({
    file,
    input_files = '',
    operator = ''
}) => {
    const {
        tree,
        createFile
    } = useTreeActions();

    file.startsWith('\'') &&
    file.startsWith('\'') &&
    file.includes(' ') &&
    (file = file.substring(1, file.length - 1));

    file = realpath(file);

    if (operator) {
        if (!input_files) {
            // création d'un fichier vide

            const path = file.split('/');
            const completeFilename = path.pop()!;
            const [filename, ...extension] = completeFilename.split('.');

            createFile(path.join('/'), {
                name: filename,
                type: 'text',
                extension: extension.join('.')
            });

            console.log(tree.value);

            return ['']
        }
        else {
            // création d'un fichier à partir de un ou plusieurs autres fichiers

            const notEmptyFiles = input_files.split(' ')
                .reduce<string[]>((r, file) => {
                    if (
                        file.endsWith('\'') ||
                        ([...r].pop() ?? '').startsWith('\'')
                    ) {
                        const last = r.pop()!;
                        return [...r, last + file];
                    }
                    return [...r, file];
                }, [])
                .filter(it => it !== '');
            const filesExistingStatus = notEmptyFiles
                .map(file => realpath(file))
                .map<[boolean, string]>(file => [isPathExists(file), file]);
            const notExistingFiles = filesExistingStatus
                .filter(([isExists]) => !isExists);
            const existingFiles = filesExistingStatus
                .filter(([isExists]) => isExists)
                .map(([,file]) => file);

            if (notExistingFiles.length > 0) {
                return notExistingFiles
                    .map(([,file]) =>
                        `cat: ${file}: Aucun fichier ou dossier de ce type`)
            }

            const content = existingFiles.map((file) => {
                const path = file.split('/');
                const completeFilename = path.pop()!;
                const [filename, ...extension] = completeFilename.split('.');

                return tree.value
                    .filter(item => item.type !== 'directory')
                    .filter(f =>
                        f.parent === (path.join('/') === '' ? '/' : path.join('/')) &&
                        f.name === filename &&
                        f.extension === extension.join('.')
                    ).pop()!
            })
            .map(file => file.content).join('');

            const path = file.split('/');
            const completeFilename = path.pop()!;
            const [filename, ...extension] = completeFilename.split('.');

            try {
                createFile((path.join('/') === '' ? '/' : path.join('/')), {
                    name: filename,
                    type: 'text',
                    extension: extension.join('.')
                }, content);
            } catch (err: any) {
                return [`cat: ${err.message}`];
            }

            return ['']
        }
    }

    if (!isPathExists(file)) {
        return `cat: ${file}: Aucun fichier ou dossier de ce type`;
    }

    const path = file.split('/');
    const completeFilename = path.pop()!;
    const [filename, ...extension] = completeFilename.split('.')

    const selectedFile = tree.value
        .filter(item => item.type !== 'directory')
        .filter(f =>
            f.parent === (path.join('/') === '' ? '/' : path.join('/')) &&
            f.name === filename &&
            f.extension === extension.join('.')
        );

    if (selectedFile.length === 0) {
        return `cat: ${completeFilename}: est un dossier`;
    }

    return selectedFile.pop()!.content?.split("\n") ?? [''];
}