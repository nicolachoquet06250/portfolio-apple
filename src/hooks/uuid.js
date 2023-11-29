import {computed, ref} from "vue";
import { v4 as uuidv4 } from "uuid";

/** @var {import('vue').Ref<string>} */
const uuid = ref('');

/** @return {import('vue').ComputedRef<string>} */
export const useUuid = () => {
    uuid.value = uuidv4();

    return computed(() => uuid.value);
}