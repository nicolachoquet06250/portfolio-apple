import { reactive, computed } from 'vue';

export type User = {
    id: number,
    full_name: string,
    account_name: string
}

const authUser = reactive<User>({
    id: 0,
    full_name: '',
    account_name: ''
})

export const useAuthUser = () => ({
    user: computed(() => authUser),

    authUser(id: User['id'], fullName: User['full_name'], accountName: User['account_name']) {
        authUser.id = id;
        authUser.full_name = fullName;
        authUser.account_name = accountName;
    }
});