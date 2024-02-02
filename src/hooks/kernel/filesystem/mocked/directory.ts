import type {
    DirectoryItem,
    UseFileSystemReturn
} from '../types.ts';

import {fsTree} from '../index';
import {directoryExists, directoryHasChildren} from '@/hooks/kernel/filesystem/functions.ts';

export const create: UseFileSystemReturn['directory']['create'] =
    (directory, force = false) => {
        const pathExists = fsTree.value.filter(i => {
            const path = directory.path.split('/');
            const name = path.pop();
            return i.type === 'directory'
                && i.path === path.join('/')
                && i.name === name;
        }).length === 1;

        const directoryExists = fsTree.value.filter(i =>
            i.type === 'directory' &&
            i.path === directory.path &&
            i.name === directory.name
        ).length === 1;

        if (!force && (!pathExists || !directoryExists)) {
            throw Error(`impossible de créer le répertoire «${directory.path}/${directory.name}»: Aucun fichier ou dossier de ce type`);
        }

        if (force && (!pathExists || !directoryExists)) {
            let iterationPath = '';
            const rootPath = '/';
            for (let i = 0; i < directory.path.split('/').length; i++) {
                iterationPath += '/' + directory.path.split('/')[i];
                iterationPath = (iterationPath.startsWith('//') ? iterationPath.substring(1) : iterationPath);

                const path = iterationPath.split('/');
                path.shift()
                const name = path.pop();
                const joinedPath = '/' + path.join('/');

                const iterationPathExists = fsTree.value.filter(i =>
                    i.type === 'directory' &&
                    (
                        (
                            iterationPath === rootPath &&
                            i.path === '' && i.name === rootPath
                        ) ||
                        (
                            i.path === joinedPath
                            && i.name === name
                        )
                    )
                ).length === 1;

                if (!iterationPathExists) {
                    const path = iterationPath.split('/');
                    path.shift()
                    const name = path.pop();

                    const item: DirectoryItem = {
                        type: 'directory',
                        path: '/' + path.join('/'),
                        name: name!
                    };

                    fsTree.value = [...fsTree.value, item]
                }
            }
        }

        if (pathExists && !directoryExists) {
            const item: DirectoryItem = {
                type: 'directory',
                ...directory
            };

            fsTree.value = [...fsTree.value, item]
        }
    }

export const remove: UseFileSystemReturn['directory']['remove'] =
    (directory, force = false) => {
        if (!directoryExists(directory) && !force) {
            throw new Error(`impossible de supprimer '/${directory.path}/${directory.name}': Aucun fichier ou dossier de ce type`);
        }

        const hasChildren = directoryHasChildren(directory);
        if (hasChildren) {
            if (!force) {
                throw new Error(`impossible de supprimer '${directory.path}/${directory.name}/': est un dossier`)
            }

            fsTree.value = fsTree.value.filter(i =>
                !i.path.startsWith(directory.path + '/' + directory.name)
            )
        }

        fsTree.value = fsTree.value.filter(i =>
            i.type === 'file' ||
            (
                i.path !== directory.path ||
                i.name !== directory.name
            )
        )
    };

export const rename: UseFileSystemReturn['directory']['rename'] =
    (from, to) => {
        if (!directoryExists(from)) {
            throw new Error(`impossible d'évaluer '${from.path}/${from.name}': Aucun fichier ou dossier de ce type`)
        }

        const toPath = to.path.split('/');
        const toName = toPath.pop();
        const fromPath = from.path.split('/');
        fromPath.pop();

        if (!directoryExists({
            path: toPath.join('/'),
            name: toName!
        }) && toPath.length > fromPath.length) {
            throw new Error(`impossible de déplacer '${from.path}/${from.name}/' vers '${to.path}/${to.name}': Aucun fichier ou dossier de ce type`)
        }

        fsTree.value = fsTree.value.map(i => i.path.startsWith(from.path + '/' + from.name) ? {
            ...i,
            path: to.path + '/' + to.name + i.path.substring((from.path + '/' + from.name).length)
        } : i);

        fsTree.value = fsTree.value.map(i =>
            i.type === 'directory' &&
            i.path === from.path &&
            i.name === from.name ?
                { ...i, ...to } : i
        );
    };
