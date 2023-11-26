import { ref, reactive, computed } from 'vue';

const fullName = ref('');
const accountName = ref('');
const user = reactive({
    firstName: '',
    lastName: ''
});

export const useAccount = () => ({
    fullName: computed(() => fullName.value),
    accountName: computed(() => accountName.value),
    user: computed(() => user),

    /**
     * @param {String} fullname 
     * @param {String} accountname 
     */
    createAccount(fullname, accountname) {
        fullName.value = fullname;
        accountName.value = accountname;
        user.firstName = fullname.split(' ')[0];
        user.lastName = fullname.split(' ')[1] ?? '';
    }
});