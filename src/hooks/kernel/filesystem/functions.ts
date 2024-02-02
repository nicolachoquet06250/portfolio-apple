import {fsTree} from './index';
import type {Directory, File} from './types';

export const directoryHasChildren = (directory: Directory): boolean =>
    fsTree.value.filter(i =>
        i.path.startsWith(directory.path + '/' + directory.name)
    ).length >=1;
export const directoryExists = (directory: Directory): boolean =>
    fsTree.value.filter(i =>
        i.type === 'directory' &&
        i.path === directory.path &&
        i.name === directory.name
    ).length === 1;

export const fileExists = (file: File): boolean =>
    fsTree.value.filter(i =>
        i.type === 'file' &&
        i.path === file.path &&
        i.name === file.name &&
        i.extension === file.extension
    ).length === 1;