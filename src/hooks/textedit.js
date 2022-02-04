import { ref, computed, watch } from 'vue';
import { useDatabase, getParams, TABLES } from '@/hooks/database';

const { onSuccess, results } = useDatabase(...getParams(TABLES.TREE_STRUCTURE));

const files = ref([]);
const activeFile = ref(null);
const action = ref('');
const data = ref({});

export const useTextEdit = () => {

    /**
     * @param {{ content: String, creation_date: Date, extention: String, id: Number, user_id: Number, name: String, parent: String, opened_date: Date, type: String, updated_date: Date }} file 
     */
    const openFile = file => {
        if (!files.value.reduce((r, c) => c.name === file.name && c.extention === file.extention && c.parent === file.parent ? true : r, false)) {
            files.value = [...files.value, file];
        }
        activeFile.value = file;
    };

    return {
        files: computed(() => files.value),
        activeFile: computed(() => activeFile.value),
    
        /**
         * @param {{ content: String, creation_date: Date, extention: String, id: Number, user_id: Number, name: String, parent: String, opened_date: Date, type: String, updated_date: Date }} file 
         */
        openFile,
        /**
         * @param {Number} id 
         */
        openFileFromId(id) {
            onSuccess(({ context: { get } }) => {
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
        /**
         * @param {{ content: String, creation_date: Date, extention: String, id: Number, user_id: Number, name: String, parent: String, opened_date: Date, type: String, updated_date: Date }} file 
         */
        removeFileToList(file) {
            files.value = files.value.reduce((r, c) => c === file ? r : [...r, c], []);
        },
        /**
         * @param {{ content: String, creation_date: Date, extention: String, id: Number, user_id: Number, name: String, parent: String, opened_date: Date, type: String, updated_date: Date }} file 
         * @param {String} content 
         */
        updateFile(file, content) {
            onSuccess(({ context: { getAllValues } }) => {
                getAllValues();

                action.value = 'update';
                data.value = { file, content };
            }).connect();
        }
    };
};

watch(results, () => {
    if (action.value === 'update') {
        onSuccess(({ context: { update } }) => {
            const _file = results.value.reduce((r, c) => 
                c.parent === data.value.file.parent 
                    && c.name === data.value.file.name 
                    && c.extention === data.value.file.extention ? c : r, null);

            console.log(_file);

            const newFile = {
                ..._file,
                content: data.value.content
            };

            console.log(newFile);

            update(newFile);

            files.value = files.value.reduce((r, c) => c.id === _file.id ? [...r, newFile] : [...r, c], []);
        }).connect();
    }
})