import {useClipboard as useClipboardFromVueUse} from '@vueuse/core';
import type {UseClipboardOptions} from '@vueuse/core';
import {ref} from 'vue';
import type {Ref} from 'vue';

const copiedDuring = ref(1500);
const textIfNotSupported = ref('');
const copiedIfNotSupported = ref(false);
const copyIfNotSupported = async (text?: string|undefined) => {
    textIfNotSupported.value = text ?? '';
    copiedIfNotSupported.value = true;

    setTimeout(() => {
        textIfNotSupported.value = '';
        copiedIfNotSupported.value = false;
    }, copiedDuring.value)
};

export const useClipboard = (options?: Pick<UseClipboardOptions<Ref<string>>, 'copiedDuring'>) => {
    const source = ref('');
    if (options?.copiedDuring) (copiedDuring.value = options.copiedDuring);

    const {
        isSupported, copy,
        text, copied
    } = useClipboardFromVueUse({
        read: true,
        source,
        legacy: true,
        copiedDuring: copiedDuring.value
    });

    return isSupported.value ? {
        copy,
        text,
        copied
    } : {
        copy: copyIfNotSupported,
        text: textIfNotSupported,
        copied: copiedIfNotSupported
    };
}