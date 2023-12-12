import {ref, computed, watch, Ref, ComputedRef} from 'vue';
import { useDatabase, getParams, TABLES } from '@/hooks/database';

export type File = {
    content: string,
    creation_date: Date,
    extention: string,
    id: number,
    user_id: number,
    name: string,
    parent: string,
    opened_date: Date,
    type: string,
    updated_date: Date
};

const {
    onSuccess,
    results
} = useDatabase<File[]>(...getParams(TABLES.TREE_STRUCTURE));

const files = ref<File[]>([]);
const activeFile = ref<File|null>(null);
const action = ref('');
const data = ref<Partial<{file: Partial<File>, content: string}>>({});

type FileEvent = {
    context: {
        get(id: number): Ref<File[]>|ComputedRef<File[]>,
        getAllValues(): void,
        update(file: File): void
    }
}

export const useTextEdit = () => {
    const openFile = (file: File) => {
        if (!files.value.reduce((r, c) => c.name === file.name && c.extention === file.extention && c.parent === file.parent ? true : r, false)) {
            files.value = [...files.value, file];
        }
        activeFile.value = file;
    };

    return {
        files: computed(() => files.value),
        activeFile: computed(() => activeFile.value),

        openFile,
        openFileFromId(id: number) {
            onSuccess(({ context: { get } }: FileEvent) => {
                const all = get(id);
    
                watch(all, () => {
                    const file = all.value[0];

                    if (file && ['application', 'directory'].indexOf(file.type) === -1) {
                        console.log(file);
                        
                        openFile(file);
                        console.log(files.value)
                    }
                })
            }).connect();
        },
        removeFileToList(file: File) {
            files.value = files.value.reduce<File[]>((r, c) =>
                c === file ? r : [...r, c], []);
        },
        updateFile(file: File, content: string) {
            onSuccess(({ context: { getAllValues } }: FileEvent) => {
                getAllValues();

                action.value = 'update';
                data.value = { file, content };
            }).connect();
        }
    };
};

watch(results, () => {
    if (action.value === 'update') {
        onSuccess(({ context: { update } }: FileEvent) => {
            const _file = results.value.reduce<File|null>((r, c) =>
                c.parent === data.value.file!.parent
                    && c.name === data.value.file!.name
                    && c.extention === data.value.file!.extention ? c : r, null);

            console.log(_file);

            const newFile = {
                ..._file,
                content: data.value.content!
            } as File;

            console.log(newFile);

            update(newFile);

            files.value = files.value.reduce<File[]>((r, c) =>
                c.id === _file!.id ? [...r, newFile] : [...r, c], []);
        }).connect();
    }
})