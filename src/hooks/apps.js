import { reactive, ref, computed, watch } from 'vue';
import { useMousePressed, useMouse, useWindowSize, useMouseInElement } from '@vueuse/core';

import FinderApp from '@/applications/Finder.vue';
import StoreApp from '@/applications/Store.vue';
import MailsApp from '@/applications/Mail.vue';
import MessagesApp from '@/applications/Messages.vue';
import SettingsApp from '@/applications/Settings.vue';
import TerminalApp from '@/applications/Terminal.vue';
import TrashApp from '@/applications/Trash.vue';

import FinderHeader from '@/applications/header/Finder.vue';

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
        body: StoreApp
    },
    [APPLICATION.MAILS]: {
        body: MailsApp
    },
    [APPLICATION.MESSAGES]: {
        body: MessagesApp
    },
    [APPLICATION.SETTINGS]: {
        body: SettingsApp
    },
    [APPLICATION.TERMINAL]: {
        body: TerminalApp
    },
    [APPLICATION.TRASH]: {
        body: TrashApp
    }
};

const currentApp = ref(null);
const currentAppMenus = reactive({});
const openedApplications = reactive({});
const applicationsHistory = ref([]);


/**
 * @param {Number} width 
 * @param {Number} height 
 */
const setCurrentAppSize = (width, height) => {
    openedApplications[currentApp.value].size = { width, height };
};

/**
 * @param {Number} x 
 * @param {Number} y 
 */
const setCurrentAppPosition = (x, y) => {
    openedApplications[currentApp.value].position = { x, y };
};

/**
 * @param {import('vue').Ref<HTMLElement>} application 
 * @param {String} code
 * @param {Number} width
 * @param {Number} height
 * @param {Number} x
 * @param {Number} y
 * @returns 
 */
export const useAppActions = (application, code, { width: defaultWidth, height: defaultHeight }, { x: defaultX, y: defaultY }) => {
    /**
     * Reactives variables
     */
    
    const currentPosition = reactive({ x: defaultX, y: defaultY });
    const currentSize = reactive({ width: defaultWidth, height: defaultHeight });
    const mousePressed = reactive({
        move: false,
        resize: false,
        resizeSens: ''
    });
    const onClickMousePosition = reactive({ x: 0, y: 0 });

    /**
     * References variables
     */
    
    const applicationHeader = ref(null);

    const applicationResizerLeft = ref(null);
    const applicationResizerRight = ref(null);
    const applicationResizerTop = ref(null);
    const applicationResizerBottom = ref(null);

    /**
     * Use hooks
     */
    
    const { pressed: headerPressed } = useMousePressed({
        target: applicationHeader,
        touch: false
    });

    const { pressed: resizeLeftPressed } = useMousePressed({
        target: applicationResizerLeft, 
        touch: false
    });
    const { pressed: resizeRightPressed } = useMousePressed({
        target: applicationResizerRight,
        touch: false
    });
    const { pressed: resizeTopPressed } = useMousePressed({
        target: applicationResizerTop,
        touch: false
    });
    const { pressed: resizeBottomPressed } = useMousePressed({
        target: applicationResizerBottom,
        touch: false
    });
    const { x: mouseX, y: mouseY } = useMouse();
    const { isOutside } = useMouseInElement(application);
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    /**
     * Computed constantes
     */
    const isInside = computed(() => !isOutside.value);

    /**
     * Reference watchers
     */

    watch(application, () => {
        if (application.value) {
            applicationHeader.value = application.value.querySelector('.app-header-bar');

            applicationResizerLeft.value = application.value.querySelector('.resize-left');
            applicationResizerRight.value = application.value.querySelector('.resize-right');
            applicationResizerTop.value = application.value.querySelector('.resize-top');
            applicationResizerBottom.value = application.value.querySelector('.resize-bottom');
        }
    });

    watch(headerPressed, () => {
        mousePressed.move = headerPressed.value;

        if (mousePressed.move) {
            onClickMousePosition.x = mouseX.value;
            onClickMousePosition.y = mouseY.value;
        }
    });

    watch([resizeLeftPressed, resizeRightPressed, resizeTopPressed, resizeBottomPressed], () => {
        mousePressed.resize = resizeLeftPressed.value || resizeRightPressed.value || resizeTopPressed.value || resizeBottomPressed.value;
        
        if (resizeLeftPressed.value) {
            mousePressed.resizeSens = 'left';
        } else if(resizeRightPressed.value) {
            mousePressed.resizeSens = 'right';
        } else if(resizeTopPressed.value) {
            mousePressed.resizeSens = 'top';
        } else if(resizeBottomPressed.value) {
            mousePressed.resizeSens = 'bottom';
        } else {
            mousePressed.resizeSens = '';
        }

        if (mousePressed.resize) {
            onClickMousePosition.x = mouseX.value;
            onClickMousePosition.y = mouseY.value;
        }
    });

    watch([mouseX, mouseY], (_, [oldMouseX, oldMouseY]) => {
        if (mousePressed.move) {
            if (isInside.value) {
                currentPosition.x = currentPosition.x + (mouseX.value - oldMouseX);
                if (mouseY.value - (applicationHeader.value.offsetHeight / 2) > 0) {
                    currentPosition.y = mouseY.value - applicationHeader.value.offsetHeight;
                } else {
                    currentPosition.y = 0;
                }
            } else {
                currentPosition.x = currentPosition.x + (mouseX.value - oldMouseX);
                if (mouseY.value - (applicationHeader.value.offsetHeight / 2) > 0) {
                    currentPosition.y = mouseY.value - applicationHeader.value.offsetHeight;
                } else {
                    currentPosition.y = 0;
                }
            }
        }

        if (mousePressed.resize) {
            if (mousePressed.resizeSens === 'right') {
                currentSize.width += (mouseX.value - oldMouseX);

                if (currentSize.width === application.value.offsetWidth) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }
        
            if (mousePressed.resizeSens === 'left') {
                currentSize.width += (oldMouseX - mouseX.value);
                currentPosition.x = onClickMousePosition.x - (onClickMousePosition.x - mouseX.value);
        
                if (currentSize.width === application.value.offsetWidth) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }
        
            if (mousePressed.resizeSens === 'bottom') {
                currentSize.height += (mouseY.value - oldMouseY);
                
                if (currentSize.height === application.value.offsetHeight) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }
        
            if (mousePressed.resizeSens === 'top') {
                currentSize.height += (oldMouseY - mouseY.value);
                currentPosition.y = onClickMousePosition.y - (onClickMousePosition.y - mouseY.value) - 25;
                
                if (currentSize.height === application.value.offsetHeight) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }

            if (mousePressed.resize && application.value.offsetWidth >= windowWidth.value) {
                mousePressed.resize = false;
                mousePressed.resizeSens = '';
            }
        }
    });

    watch(() => currentSize.width, (_, oldSizeWidth) => {
        if(currentSize.width === oldSizeWidth) {
            mousePressed.resize = false;
            mousePressed.resizeSens = '';
        }
    });

    return {
        size: currentSize,
        position: computed(() => currentPosition),
        bodyHeight: computed(() => (currentSize.height - applicationHeader.value?.offsetHeight - 20) + 'px'),

        move({ x, y }) {
            currentPosition.x = x;
            currentPosition.y = y;
        },
        resize({ width, height }) {
            currentSize.width = width;
            currentSize.height = height;
        },
        close() {},
        open() {},
        minimize() {},
        maximize() {}
    };
};

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

    setCurrentAppSize,
    setCurrentAppPosition
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
                    y: 13
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