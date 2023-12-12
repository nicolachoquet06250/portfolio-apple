// @ts-nocheck
import {computed, ref} from "vue";
import { v4 as uuidv4 } from "uuid";

const uuid = ref('');

export const useUuid = () => {
    uuid.value = uuidv4();

    return computed(() => uuid.value);
}