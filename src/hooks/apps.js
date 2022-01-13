import { reactive, ref, computed } from 'vue';

import FinderApp from '@/applications/Finder.vue';
import StoreApp from '@/applications/Store.vue';
import MailsApp from '@/applications/Mail.vue';
import MessagesApp from '@/applications/Messages.vue';
import SettingsApp from '@/applications/Settings.vue';
import TerminalApp from '@/applications/Terminal.vue';
import TrashApp from '@/applications/Trash.vue';

export const APPLICATION = {
    FINDER: 'finder',
    STORE: 'appstore',
    MAILS: 'mail',
    MESSAGES: 'messages',
    SETTINGS: 'preferences',
    TERMINAL: 'terminal',
    TRASH: 'trash'
};

export const APPLICATION_STATE = {
    CLOSED: 'closed',
    OPENED: 'opened',
    IN_DOCK: 'in_dock'
};

export const APPLICATION_COMPONENT = {
    [APPLICATION.FINDER]: FinderApp,
    [APPLICATION.STORE]: StoreApp,
    [APPLICATION.MAILS]: MailsApp,
    [APPLICATION.MESSAGES]: MessagesApp,
    [APPLICATION.SETTINGS]: SettingsApp,
    [APPLICATION.TERMINAL]: TerminalApp,
    [APPLICATION.TRASH]: TrashApp
};

const currentApp = ref(null);
const currentAppMenus = ref({});
const currentAppHeaderBar = ref({});
const openedApplications = reactive({});
const applicationsHistory = ref([]);

export const useCurrentApp = () => ({
    currentApp: computed(() => currentApp.value),

    setCurrentApp(_currentApp) {
        currentApp.value = _currentApp;
    },

    /**
     * @param {Record<String, any>} _currentAppMenus 
     */
    setCurrentAppMenus(_currentAppMenus) {
        currentAppMenus.value = {
            ...currentAppMenus.value,
            ..._currentAppMenus
        };
    },

    /**
     * @param {Record<String, any>} _currentAppHeaderBar 
     */
    setCurrentAppHeaderBar(_currentAppHeaderBar) {
        currentAppHeaderBar.value = {
            ...currentAppHeaderBar.value,
            ..._currentAppHeaderBar
        }
    }
});

export const useOpenedApplications = () => ({
    openedApplications: computed(() => openedApplications),
    applicationsHistory: computed(() => applicationsHistory.value),
    lastApplicationOpened: computed(() => applicationsHistory.value[applicationsHistory.value.length - 1]),

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    openApplication(application) {
        if (openedApplications[application.toLowerCase()]) {
            openedApplications[application.toLowerCase()] = {
                ...openedApplications[application.toLowerCase()],
                state: APPLICATION_STATE.OPENED
            }
        } else {
            openedApplications[application.toLowerCase()] = {
                state: APPLICATION_STATE.OPENED,
                full_screen: false,
                name: application.substr(0, 1).toUpperCase() + application.substr(1, application.length - 1),
                component: APPLICATION_COMPONENT[application.toLowerCase()],
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: 500,
                    height: 500
                }
            }
        }

        console.log(openedApplications[application.toLowerCase()].component)

        applicationsHistory.value = [...applicationsHistory.value, application.toLowerCase()];
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    applicationToDock(application) {
        openedApplications[application.toLowerCase()] = {
            ...openedApplications[application.toLowerCase()],
            state: APPLICATION_STATE.IN_DOCK
        }

        if (application.toLowerCase() !== APPLICATION.FINDER) {
            applicationsHistory.value = applicationsHistory.value.reduce((r, c) => c === application.toLowerCase() ? r : [...r, c], []);
        }
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    maximizeApplication(application) {
        openedApplications[application.toLowerCase()] = {
            ...openedApplications[application.toLowerCase()],
            state: APPLICATION_STATE.OPENED,
            full_screen: true,
        }

        if (applicationsHistory.value.indexOf(application.toLowerCase()) === -1) {
            applicationsHistory.value = [...applicationsHistory.value, application.toLowerCase()];
        }
    },

    minifyApplication(application) {
        openedApplications[application.toLowerCase()] = {
            ...openedApplications[application.toLowerCase()],
            state: APPLICATION_STATE.OPENED,
            full_screen: false,
        }

        if (applicationsHistory.value.indexOf(application.toLowerCase()) === -1) {
            applicationsHistory.value = [...applicationsHistory.value, application.toLowerCase()];
        }
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    closeApplication(application) {
        openedApplications[application.toLowerCase()] = {
            ...openedApplications[application.toLowerCase()],
            state: APPLICATION_STATE.CLOSED
        }

        if (application.toLowerCase() !== APPLICATION.FINDER) {
            applicationsHistory.value = applicationsHistory.value.reduce((r, c) => c === application.toLowerCase() ? r : [...r, c], []);
        }
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     * @param {{ x: Number, y: Number }} size
     */
    resizeApplication(application, size) {
        openedApplications[application.toLowerCase()] = {
            ...openedApplications[application.toLowerCase()],
            size: {
                ...openedApplications[application.toLowerCase()].size,
                ...size
            }
        }
    },

    initApplicationHistory() {
        applicationsHistory.value = [APPLICATION.FINDER];
    }
});