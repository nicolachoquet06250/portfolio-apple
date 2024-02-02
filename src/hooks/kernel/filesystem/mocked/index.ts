export * as file from './file';
export * as directory from './directory';
import {fsTree} from '../../filesystem';

// mock init
export default () => {
    fsTree.value = [
        {
            type: 'directory',
            path: '',
            name: '/'
        },
        {
            type: 'directory',
            path: '/',
            name: 'test'
        },
        {
            type: 'directory',
            path: '/test',
            name: 'toto'
        },
    ];
}