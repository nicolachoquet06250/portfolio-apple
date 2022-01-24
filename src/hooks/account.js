import { reactive, computed } from 'vue';

const authUser = reactive({
    id: 0,
    full_name: '',
    account_name: ''
})

export const useAuthUser = () => ({
    user: computed(() => useAuthUser),

    authUser(id, full_name, account_name) {
        authUser.id = id;
        authUser.full_name = full_name;
        authUser.account_name = account_name;
    }
});