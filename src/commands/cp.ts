import {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {generateHelp, preg_match} from '@/hooks/terminal/commands';
import finder, {realpath} from '@/hooks/finder';

export const command: TerminalCommand['command'] =
    /^cp( ?(?<flags>-[a-zA-Z0-9\-_=.\/]+) ?)?( ?(?<files>[a-zA-Z0-9_\-\/. ']*) (?<dist>[a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+'))?$/g;
export const adminCommand: TerminalCommand['adminCommand'] =
    /^sudo cp( ?(?<flags>-[a-zA-Z0-9\-_=.\/]+) ?)?( ?(?<files>[a-zA-Z0-9_\-\/. ']*) (?<dist>[a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+'))?$/g;
export const description: TerminalCommand['description'] =
    'Copier la SOURCE vers DEST ou plusieurs SOURCEs vers RÉPERTOIRE';
export const usage: TerminalCommand['usage'] = 'cp [-R | -r | --recursive] SOURCE... RÉPERTOIRE';
export const flags: TerminalCommand['flags'] = [
    {
        long: 'recursive',
        short: 'R',
        type: Boolean,
        description: 'copier récursivement les répertoires'
    },
    {
        long: 'recursive',
        short: 'r',
        type: Boolean,
        description: 'copier récursivement les répertoires'
    }
];

export const help: TerminalCommand['help'] = () => generateHelp(usage, flags, description);

const {isPathExists, useTreeActions} = finder()

type Props = {
    files: string,
    dist: string
}
type Flags = {
    recursive: boolean
}
type Setters = {}

export const execute: TerminalCommandExecute<Props, Flags, Setters> = (
    { files, dist }, _, {recursive}
) => {
    const { tree, createFile, add } = useTreeActions()

    if (files && dist) {
        const matchedFiles =
            preg_match(/([a-zA-Z0-9_\-\/.]+|'[a-zA-Z0-9_\-\/. ]+')/g, files);
        dist = realpath(dist);

        const _files: string[] = matchedFiles instanceof Array ?
            [...matchedFiles]
                .map<[boolean, string]>(item => [isPathExists(realpath(item)), realpath(item)])
                .filter(([exists]) => exists)
                .map<string>(([, path]) => path)
                .reduce<string[]>((r, c) => [
                    ...r,
                    ...(r.includes(c) ? [] : [c])
                ], []) :
            [];

        if (_files.length === 1) {
            // on a que 1 fichier ou répertoire à copier
            const [file] = _files;

            if (file.includes('.')) {
                // je copie un fichier explicitement
                if (!dist.includes('.')) {
                    // je veux coller dans un répertoire
                    const path = file.split('/');
                    const filename = path.pop()!;
                    const [name, ...extension] = filename.split('.');
                    console.log('1')

                    const distPath = dist.split('/');
                    const distDirname = distPath.pop()!;

                    if (!isPathExists(dist)) {
                        add(realpath(distPath.join('/')), distDirname);
                        console.log(tree.value);
                    }

                    try {
                        createFile(
                            (dist === '' ? '/' : dist),
                            {
                                name,
                                type: 'text',
                                extension: extension.join('.')
                            },
                            tree.value
                                .filter(item =>
                                    item.type !== 'directory' &&
                                    item.name === name &&
                                    item.parent === path.join('/') &&
                                    item.extension === extension.join('.')
                                ).pop()?.content ?? ''
                        )

                        return [''];
                    } catch (err: any) {
                        return `cp: ${err.message}`;
                    }
                }
                else {
                    // je veux coller dans un répertoire en re nomant le fichier
                    const fromPath = file.split('/');
                    const fromFilename = fromPath.pop()!;
                    const [fromName, ...fromExtension] = fromFilename.split('.');

                    const distPath = dist.split('/');
                    const distFilename = distPath.pop()!;
                    const [distName, ...distExtension] = distFilename.split('.');

                    try {
                        createFile(
                            (distPath.join('/') === '' ? '/' : distPath.join('/')),
                            {
                                name: distName,
                                type: 'text',
                                extension: distExtension.join('.')
                            },
                            tree.value
                                .filter(item =>
                                    item.type !== 'directory' &&
                                    item.name === fromName &&
                                    item.parent === fromPath.join('/') &&
                                    item.extension === fromExtension.join('.')
                                ).pop()?.content ?? ''
                        )

                        return [''];
                    } catch (err: any) {
                        return `cp: ${err.message}`;
                    }
                }
            } else {
                // je copie un répertoire
                if (recursive) {
                    const newFiles = tree.value.filter(item => item.parent.startsWith((file === '' ? '/' : file)));
                    if (!isPathExists(dist)) {
                        const distPath = dist.split('/');
                        const distFilename = distPath.pop()!;

                        add((distPath.join('/') === '' ? '/' : distPath.join('/')), distFilename);
                    }

                    for (const f of newFiles) {
                        if (f.type === 'directory') {
                            add(dist + f.parent.substring(dist.length), f.name)
                        } else {
                            createFile(dist + f.parent.substring(dist.length), {
                                name: f.name,
                                type: f.type,
                                extension: f.extension
                            }, f.content)
                        }
                    }

                    console.log(tree.value)

                    return [''];
                } else {
                    return `cp: ${file}: est un dossier`
                }
            }
        }
        else {

        }

        console.log(_files, dist);
    }
    else {
        return [
            'cp: operande de fichier manquant',
            'Saisissez << cp --help >> pour plus d\'informations.'
        ]
    }
}