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

const lastApplicationOpened = computed(() => applicationsHistory.value.length === 1 ? 'finder' : applicationsHistory.value[applicationsHistory.value.length - 1]);


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

const setCurrentApp = _currentApp => {
    currentApp.value = _currentApp;
};

const closeApplication = application => {
    openedApplications[application.toLowerCase()].state = APPLICATION_STATE.CLOSED;

    if (application.toLowerCase() !== APPLICATION.FINDER) {
        applicationsHistory.value = applicationsHistory.value.reduce((r, c) => c === application.toLowerCase() ? r : [...r, c], []);
    }
};

/**
 * @param {import('vue').Ref<HTMLElement>} application 
 * @param {String} code
 * @param {import('vue').Ref<Boolean>} opened
 * @returns 
 */
export const useAppActions = (application, code, opened) => {
    /**
     * Reactives variables
     */
    
    const currentSize = reactive({ width: openedApplications[code].size.width, height: openedApplications[code].size.height });
    const currentPosition = reactive({ x: openedApplications[code].position.x, y: openedApplications[code].position.y });
    const mousePressed = reactive({
        move: false,
        resize: false,
        resizeSens: ''
    });
    const onClickMousePosition = reactive({ x: 0, y: 0 });

    /**
     * References variables
     */
    
    const close = ref(false);

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
    const { width: windowWidth } = useWindowSize();

    /**
     * Computed constantes
     */
    const isInside = computed(() => !isOutside.value);

    const resize = ({ width, height }) => {
        currentSize.width = width;
        currentSize.height = height;
    };

    const move = ({ x, y }) => {
        currentPosition.x = x;
        currentPosition.y = y;
    };

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
            move({
                x: currentPosition.x + (mouseX.value - oldMouseX), 
                y: (mouseY.value - (applicationHeader.value.offsetHeight / 2) > 0 ? mouseY.value - applicationHeader.value.offsetHeight : 0)
            });
        }

        if (mousePressed.resize) {
            if (mousePressed.resizeSens === 'right') {
                resize({
                    width: currentSize.width + (mouseX.value - oldMouseX), 
                    height: currentSize.height
                });

                if (currentSize.width === application.value.offsetWidth) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }

            if (mousePressed.resize && mousePressed.resizeSens === '') {
                if (mouseX.value < onClickMousePosition.x) {
                    mousePressed.resizeSens = 'left';
                }
            }
        
            if (mousePressed.resizeSens === 'left') {
                resize({
                    width: currentSize.width + (oldMouseX - mouseX.value), 
                    height: currentSize.height
                });
                move({
                    x: onClickMousePosition.x - (onClickMousePosition.x - mouseX.value), 
                    y: currentPosition.y
                });
        
                if (application.value.offsetWidth === parseInt(application.value.style.minWidth.replace('px', '')) && mouseX.value > onClickMousePosition.x) {
                    mousePressed.resizeSens = '';
                }
            }
        
            if (mousePressed.resizeSens === 'bottom') {
                resize({
                    height: currentSize.height + (mouseY.value - oldMouseY), 
                    width: currentSize.width
                });
                
                if (currentSize.height === application.value.offsetHeight) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }
        
            if (mousePressed.resizeSens === 'top') {
                resize({
                    height: currentSize.height + (oldMouseY - mouseY.value),
                    width: currentSize.width
                });
                move({
                    y: onClickMousePosition.y - (onClickMousePosition.y - mouseY.value) - 25, 
                    x: currentPosition.x
                });
                
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

    watch([() => openedApplications[code].size.width, () => openedApplications[code].size.height], () => {
        resize({
            width: openedApplications[code].size.width, 
            height: openedApplications[code].size.height
        });
    });

    watch([() => openedApplications[code]?.position.x, () => openedApplications[code]?.position.y], () => {
        move({
            x: openedApplications[code]?.position.x, 
            y: openedApplications[code]?.position.y
        });
    });

    return {
        close: computed(() => close.value),
        size: currentSize,
        position: computed(() => currentPosition),
        bodyHeight: computed(() => (currentSize.height - applicationHeader.value?.offsetHeight - 20) + 'px'),

        move,
        resize,
        closeApp() {
            close.value = true;
    
            const animationend = () => {
                opened.value = false;
                closeApplication(code);
                setTimeout(() => setCurrentApp(lastApplicationOpened.value), 1000);
                close.value = false;

                move({
                    x: 0, 
                    y: 0
                });
                resize({
                    width: 777, 
                    height: 313
                });

                application.value.removeEventListener('animationend', animationend);
            };

            application.value.addEventListener('animationend', animationend);
        },
        minimize() {},
        maximize() {}
    };
};

export const useCurrentApp = () => ({
    currentApp: computed(() => currentApp.value),
    currentAppMenus: computed(() => currentAppMenus),

    setCurrentApp,

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
    lastApplicationOpened,

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
    closeApplication,

    initApplicationHistory() {
        applicationsHistory.value = [APPLICATION.FINDER];
    }
});