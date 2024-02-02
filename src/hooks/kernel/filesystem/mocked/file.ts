import type {FileItem, UseFileSystemReturn} from '../types';
import {fsTree} from '../index';
import {create as createDirectory} from './directory';
import {directoryExists, fileExists} from '../functions';

export const create: UseFileSystemReturn['file']['create'] =
    (file, force = false) => {
        const fileExists = fsTree.value.filter(i =>
            i.type === 'file' &&
            i.path === file.path &&
            i.name === file.name &&
            i.extension === file.extension
        ).length === 1;

        const directoryPath = file.path.split('/');
        const directoryName = directoryPath.pop();

        createDirectory({
            path: directoryPath.join('/'),
            name: directoryName!
        }, force);

        const pathExists = fsTree.value.filter(i => {
            const path = file.path.split('/');
            const name = path.pop();
            return i.type === 'directory'
                && i.path === path.join('/')
                && i.name === name;
        }).length === 1;

        const item: FileItem = {
            type: 'file',
            ...file,
            content: ''
        };

        if (pathExists && !fileExists) {
            fsTree.value = [...fsTree.value, item]
        }
    };

export const remove: UseFileSystemReturn['file']['remove'] =
    (file, force = false) => {
        if (!fileExists(file) && !force) {
            throw new Error(`impossible de supprimer '${file.path}/${file.name}.${file.extension}': Aucun fichier ou dossier de ce type`)
        }

        fsTree.value = fsTree.value.filter(i =>
            i.type === 'directory' ||
            (
                i.path !== file.path ||
                i.name !== file.name ||
                i.extension !== file.extension
            )
        )
    };

export const rename: UseFileSystemReturn['file']['rename'] =
    (from, to) => {
        if (!fileExists(from)) {
            throw new Error(`impossible d'évaluer '${from.path}/${from.name}.${from.extension}': Aucun fichier ou dossier de ce type`)
        }

        const toPath = to.path.split('/');
        const toName = toPath.pop();
        const fromPath = from.path.split('/');
        fromPath.pop();

        if (!directoryExists({
            path: toPath.join('/'),
            name: toName!
        })) {
            throw new Error(`impossible de déplacer '${from.path}/${from.name}.${from.extension}' vers '${to.path}/${to.name}.${to.extension}': Aucun fichier ou dossier de ce type`)
        }

        fsTree.value = fsTree.value.map(i =>
            i.type === 'file' &&
            i.path === from.path &&
            i.name === from.name &&
            i.extension === from.extension ?
                { ...i, ...to } : i
        );
    };

export const update: UseFileSystemReturn['file']['update'] =
    (file, content = '') => {
        if (!fileExists(file)) {
            create(file);
        }

        fsTree.value = fsTree.value.map(i =>
            i.type === 'file' &&
            i.path === file.path &&
            i.name === file.name &&
            i.extension === file.extension ?
                { ...i, content } : i
        )
    };