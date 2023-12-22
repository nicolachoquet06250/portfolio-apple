import { ref, computed, watch } from 'vue';
import { useDatabase } from '@/hooks/database/hooks';
import { Models } from '@/hooks/database';

const {
    treeStructures,
    ready,
    getTreeStructureFromId, getTreeStructures,
    updateTreeStructure
} = useDatabase('portfolio-apple', 'treeStructure')

const files = ref<Models['treeStructure'][]>([]);
const activeFile = ref<Models['treeStructure']|null>(null);
const action = ref('');
const data = ref<Partial<{file: Partial<Models['treeStructure']>, content: string}>>({});

export const useTextEdit = () => {
    const openFile = (file: Models['treeStructure']) => {
        if (!files.value.reduce((r, c) => c.name === file.name && c.extension === file.extension && c.parent === file.parent ? true : r, false)) {
            files.value = [...files.value, file];
        }
        activeFile.value = file;
    };

    return {
        files: computed(() => files.value),
        activeFile: computed(() => activeFile.value),
        ready,

        openFile,
        openFileFromId(id: number) {
            const all = getTreeStructureFromId(id)

            watch(all, (file) => {
                if (file && ['application', 'directory'].indexOf(file.type) === -1) {
                    console.log(file);

                    openFile(file);
                    console.log(files.value)
                }
            })
        },
        removeFileToList(file: Models['treeStructure']) {
            files.value = files.value.reduce<Models['treeStructure'][]>((r, c) =>
                c === file ? r : [...r, c], []);
        },
        updateFile(file: Models['treeStructure'], content: string) {
            const tree = getTreeStructures();

            watch(tree, () => {
                action.value = 'update';
                data.value = { file, content }
            })
        }
    };
};

watch(treeStructures, (results) => {
    if (action.value === 'update') {
        const _file = results.reduce<Models['treeStructure']|null>((r, c) =>
            c.parent === data.value.file!.parent
                && c.name === data.value.file!.name
                && c.extension === data.value.file!.extension ? c : r, null);

        console.log(_file);

        const newFile = {
            ..._file,
            content: data.value.content!
        } as Required<{id: Models['treeStructure']['id']}> & Exclude<Partial<Models['treeStructure']>, 'id'>;

        console.log(newFile);

        updateTreeStructure(newFile);

        files.value = files.value.reduce<Models['treeStructure'][]>((r, c) =>
            c.id === _file!.id ? [...r, newFile as Models['treeStructure']] : [...r, c], []);
    }
})
