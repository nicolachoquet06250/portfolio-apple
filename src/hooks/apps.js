import { reactive, ref, computed } from 'vue';

import FinderApp from '@/applications/Finder.vue';
import StoreApp from '@/applications/Store.vue';
import MailsApp from '@/applications/Mail.vue';
import MessagesApp from '@/applications/Messages.vue';
import SettingsApp from '@/applications/Settings.vue';
import TerminalApp from '@/applications/Terminal.vue';
import TrashApp from '@/applications/Trash.vue';

import FinderHeader from '@/applications/header/Finder.vue';
/*import StoreHeader from '@/applications/header/Store.vue';
import MailsHeader from '@/applications/header/Mail.vue';
import MessagesHeader from '@/applications/header/Messages.vue';
import SettingsHeader from '@/applications/header/Settings.vue';
import TerminalHeader from '@/applications/header/Terminal.vue';
import TrashHeader from '@/applications/header/Trash.vue';*/

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
    [APPLICATION.FINDER]: {
        body: FinderApp,
        header: FinderHeader
    },
    [APPLICATION.STORE]: {
        body: StoreApp,
        //header: StoreHeader
    },
    [APPLICATION.MAILS]: {
        body: MailsApp,
        //header: MailsHeader
    },
    [APPLICATION.MESSAGES]: {
        body: MessagesApp,
        //header: MessagesHeader
    },
    [APPLICATION.SETTINGS]: {
        body: SettingsApp,
        //header: SettingsHeader
    },
    [APPLICATION.TERMINAL]: {
        body: TerminalApp,
        //header: TerminalHeader
    },
    [APPLICATION.TRASH]: {
        body: TrashApp,
        //header: TrashHeader
    }
};

const currentApp = ref(null);
const currentAppMenus = reactive({});
const openedApplications = reactive({});
const applicationsHistory = ref([]);

export const useCurrentApp = () => ({
    currentApp: computed(() => currentApp.value),
    currentAppMenus: computed(() => currentAppMenus),

    setCurrentApp(_currentApp) {
        currentApp.value = _currentApp;
    },

    /**
     * @param {Record<String, any>} _currentAppMenus 
     */
    setCurrentAppMenus(_currentAppMenus) {
        openedApplications[currentApp.value].menus = _currentAppMenus;
    },

    /**
     * @param {Number} width 
     * @param {Number} height 
     */
    setCurrentAppSize(width, height) {
        openedApplications[currentApp.value].size = { width, height };
    },

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    setCurrentAppPosition(x, y) {
        openedApplications[currentApp.value].position = { x, y };
    }
});

export const useOpenedApplications = () => ({
    openedApplications: computed(() => openedApplications),
    applicationsHistory: computed(() => applicationsHistory.value),
    lastApplicationOpened: computed(() => applicationsHistory.value.length === 1 ? 'finder' : applicationsHistory.value[applicationsHistory.value.length - 1]),

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    openApplication(application) {
        if (openedApplications[application.toLowerCase()]) {
            if (openedApplications[application.toLowerCase()].state === APPLICATION_STATE.CLOSED) {
                openedApplications[application.toLowerCase()].position = {
                    x: 0,
                    y: 0
                };
                openedApplications[application.toLowerCase()].size = {
                    width: 777,
                    height: 313
                };
            }
            openedApplications[application.toLowerCase()].state = APPLICATION_STATE.OPENED;
        } else {
            openedApplications[application.toLowerCase()] = {
                state: APPLICATION_STATE.OPENED,
                full_screen: false,
                name: application.substr(0, 1).toUpperCase() + application.substr(1, application.length - 1),
                component: APPLICATION_COMPONENT[application.toLowerCase()]?.body,
                componentHeader: APPLICATION_COMPONENT[application.toLowerCase()]?.header ?? null,
                menus: {},
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: 777,
                    height: 313
                }
            }
        }

        applicationsHistory.value = [...applicationsHistory.value, application.toLowerCase()];
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    applicationToDock(application) {
        openedApplications[application.toLowerCase()].state = APPLICATION_STATE.IN_DOCK;

        if (application.toLowerCase() !== APPLICATION.FINDER) {
            applicationsHistory.value = applicationsHistory.value.reduce((r, c) => c === application.toLowerCase() ? r : [...r, c], []);
        }
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    maximizeApplication(application) {
        openedApplications[application.toLowerCase()].state = APPLICATION_STATE.OPENED;
        openedApplications[application.toLowerCase()].full_screen = true;

        if (applicationsHistory.value.indexOf(application.toLowerCase()) === -1) {
            applicationsHistory.value = [...applicationsHistory.value, application.toLowerCase()];
        }
    },

    minifyApplication(application) {
        openedApplications[application.toLowerCase()].state = APPLICATION_STATE.OPENED;
        openedApplications[application.toLowerCase()].full_screen = false;

        if (applicationsHistory.value.indexOf(application.toLowerCase()) === -1) {
            applicationsHistory.value = [...applicationsHistory.value, application.toLowerCase()];
        }
    },

    /**
     * @param {'finder'|'appstore'|'mail'|'messages'|'preferences'|'terminal'|'trash'} application 
     */
    closeApplication(application) {
        openedApplications[application.toLowerCase()].state = APPLICATION_STATE.CLOSED;

        if (application.toLowerCase() !== APPLICATION.FINDER) {
            applicationsHistory.value = applicationsHistory.value.reduce((r, c) => c === application.toLowerCase() ? r : [...r, c], []);
        }
    },

    initApplicationHistory() {
        applicationsHistory.value = [APPLICATION.FINDER];
    }
});