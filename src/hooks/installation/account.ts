import {ref, reactive, computed, ComputedRef} from 'vue';

export type User = {
    firstName: string,
    lastName: string
}

const fullName = ref('');
const accountName = ref('');
const user = reactive<User>({
    firstName: '',
    lastName: ''
});

export type UserAccount = {
    id?: number,
    fullName: ComputedRef<string>,
    accountName: ComputedRef<string>,
    user: ComputedRef<User>,
    createAccount(fullName: string, accountName: string): void
}

export type UseAccount = () => UserAccount

export const useAccount: UseAccount = () => ({
    fullName: computed(() => fullName.value),
    accountName: computed(() => accountName.value),
    user: computed(() => user),

    createAccount(full_name, account_name) {
        fullName.value = full_name;
        accountName.value = account_name;
        user.firstName = full_name.split(' ')[0];
        user.lastName = full_name.split(' ')[1] ?? '';
    }
});