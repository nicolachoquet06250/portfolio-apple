import {computed, ComputedRef, onMounted, Ref, ref, watch, watchEffect} from 'vue';
import type {
    FSTree,
    UseDirectories, UseDirectoriesReturn,
    UseFiles,
    UseFilesReturn,
    UseFileSystem,
    UseFolders,
    UseFoldersReturn
} from './types';
import initMocked, * as mockedFS from './mocked';
import initPersistent, * as persistentFS from './persistent';

export const fsTree = ref<FSTree>([]);
const asMock = ref(false);

watch(fsTree, (fsTree) => {
    console.log(fsTree)
});

export const useMock = <T extends boolean>(mock: Ref<T>|T) => {
    if (typeof mock === 'object') {
        watchEffect(() => {
            asMock.value = mock.value
        });
    }
    else {
        asMock.value = mock;
    }
};

export const useFileSystem: UseFileSystem =
    ({ mocked = false } = {}) => {
        if (mocked !== asMock.value) {
            asMock.value = mocked;
        }

        onMounted(() => {
            if (mocked) {
                initMocked();
            }
            else {
                initPersistent();
            }
        })

        return mocked ? mockedFS : persistentFS;
    };

export const useFSTree = (): ComputedRef<FSTree> => computed(() => fsTree.value);
export const useFiles: UseFiles = () => {
    const { file } = useFileSystem({mocked: asMock.value});

    return Array.from(Object.keys(file)).reduce<UseFilesReturn>((r, k) => ({
        ...r,
        [`${k}File`]: file[k as keyof typeof file]
    }), {} as UseFilesReturn);
};
export const useFolders: UseFolders = () => {
    const { directory } = useFileSystem({mocked: asMock.value});

    return Array.from(Object.keys(directory)).reduce<UseFoldersReturn>((r, k) => ({
        ...r,
        [`${k}Folder`]: directory[k as keyof typeof directory]
    }), {} as UseFoldersReturn);
};
export const useDirectories: UseDirectories = () => {
    const folders = useFolders();

    return Array.from(Object.keys(folders)).reduce<UseDirectoriesReturn>((r, k) => ({
        ...r,
        [k.replace('Folder', 'Directory')]: folders[k as keyof typeof folders]
    }), {} as UseDirectoriesReturn);
};