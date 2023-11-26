import { reactive, computed } from 'vue';

const authUser = reactive({
    id: 0,
    full_name: '',
    account_name: ''
})

export const useAuthUser = () => ({
    user: computed(() => authUser),

    authUser(id, fullName, accountName) {
        authUser.id = id;
        authUser.full_name = fullName;
        authUser.account_name = accountName;
    }
});