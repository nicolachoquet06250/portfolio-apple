import type {FSTree} from '../../filesystem/types';

export * as file from './file';
export * as directory from './directory';
import {fsTree} from '../../filesystem';

// init persistent
export default () => {
    fsTree.value = JSON.parse(localStorage.getItem('os-tree') ?? JSON.stringify([
        {
            type: 'directory',
            path: '',
            name: '/'
        },
    ])) as FSTree;
}