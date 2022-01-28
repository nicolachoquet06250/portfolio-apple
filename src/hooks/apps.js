import { reactive, ref, computed, watch } from 'vue';
import { useMousePressed, useMouse, useWindowSize } from '@vueuse/core';

import FinderApp from '@/applications/Finder.vue';
import StoreApp from '@/applications/Store.vue';
import MailsApp from '@/applications/Mail.vue';
import MessagesApp from '@/applications/Messages.vue';
import SettingsApp from '@/applications/Settings.vue';
import TerminalApp from '@/applications/Terminal.vue';
import TrashApp from '@/applications/Trash.vue';
import PhotosApp from '@/applications/Photos.vue';

import FinderHeader from '@/applications/header/Finder.vue';
import StoreHeader from '@/applications/header/Store.vue';
import MailsHeader from '@/applications/header/Mail.vue';
import MessagesHeader from '@/applications/header/Messages.vue';
import SettingsHeader from '@/applications/header/Settings.vue';
import TerminalHeader from '@/applications/header/Terminal.vue';
import TrashHeader from '@/applications/header/Trash.vue';
import PhotosHeader from '@/applications/header/Photos.vue';

import FinderMenu from '@/applications/menu/Finder.vue';
import StoreMenu from '@/applications/menu/Store.vue';
import MailsMenu from '@/applications/menu/Mail.vue';
//import MessagesMenu from '@/applications/menu/Messages.vue';
//import SettingsMenu from '@/applications/menu/Settings.vue';
//import TerminalMenu from '@/applications/menu/Terminal.vue';
//import TrashMenu from '@/applications/menu/Trash.vue';
import PhotosMenu from '@/applications/menu/Photos.vue';

export const APPLICATION = {
    FINDER: 'finder',
    STORE: 'appstore',
    MAILS: 'mail',
    MESSAGES: 'messages',
    SETTINGS: 'preferences',
    TERMINAL: 'terminal',
    TRASH: 'trash',
    PHOTOS: 'photos'
};

export const APPLICATION_STATE = {
    CLOSED: 'closed',
    OPENED: 'opened',
    IN_DOCK: 'in_dock'
};

export const APPLICATION_COMPONENT = {
    [APPLICATION.FINDER]: {
        body: FinderApp,
        header: FinderHeader,
        menu: FinderMenu
    },
    [APPLICATION.STORE]: {
        body: StoreApp,
        header: StoreHeader,
        menu: StoreMenu
    },
    [APPLICATION.PHOTOS]: {
        body: PhotosApp,
        header: PhotosHeader,
        menu: PhotosMenu
    },
    [APPLICATION.MAILS]: {
        body: MailsApp,
        header: MailsHeader,
        menu: MailsMenu
    },
    [APPLICATION.MESSAGES]: {
        body: MessagesApp,
        header: MessagesHeader,
        //menu: MessagesMenu
    },
    [APPLICATION.SETTINGS]: {
        body: SettingsApp,
        header: SettingsHeader,
        //menu: SettingsMenu
    },
    [APPLICATION.TERMINAL]: {
        body: TerminalApp,
        header: TerminalHeader,
        //menu: TerminalMenu
    },
    [APPLICATION.TRASH]: {
        body: TrashApp,
        header: TrashHeader,
        //menu: TrashMenu
    }
};

const currentApp = ref(null);
const currentAppMenus = reactive({});
const openedApplications = reactive({});
const applicationsHistory = ref([]);

const lastApplicationOpened = computed(() => applicationsHistory.value.length === 1 ? 'finder' : applicationsHistory.value[applicationsHistory.value.length - 1]);

const DIABLED_MOVABLE_HEADER_TAGS = ['a', 'i', 'button', 'input', 'label'];


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

    const headerPressed = ref(false);

    /**
     * Use hooks
     */
    
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
    const { width: windowWidth } = useWindowSize();

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
            console.log('move 1');
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
                console.log('move 2');
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
                console.log('move 3');
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
        console.log('move 4');
        move({
            x: openedApplications[code]?.position.x, 
            y: openedApplications[code]?.position.y
        });
    });

    watch(applicationHeader, () => {
        if (applicationHeader.value) {
            applicationHeader.value.addEventListener('mousedown', (e) => {
                if (DIABLED_MOVABLE_HEADER_TAGS.indexOf(e.target.tagName.toLowerCase()) === -1 && !e.target.hasAttribute('clickable')) {
                    headerPressed.value = true;
                }
            });

            applicationHeader.value.addEventListener('mouseup', () => {
                headerPressed.value = false;
            });
        }
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
                setTimeout(() => {
                    opened.value = false;
                    closeApplication(code);
                    setTimeout(() => setCurrentApp(lastApplicationOpened.value), 1000);
                    close.value = false;

                    console.log('move 5');
                    move({
                        x: 0, 
                        y: 0
                    });
                    resize({
                        width: 777, 
                        height: 313
                    });
                }, 1000);

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
            openedApplications[application.toLowerCase()].state = APPLICATION_STATE.OPENED;
        } else {
            openedApplications[application.toLowerCase()] = {
                state: APPLICATION_STATE.OPENED,
                full_screen: false,
                name: application.substr(0, 1).toUpperCase() + application.substr(1, application.length - 1),
                component: APPLICATION_COMPONENT[application.toLowerCase()]?.body,
                componentHeader: APPLICATION_COMPONENT[application.toLowerCase()]?.header ?? null,
                componentMenu: APPLICATION_COMPONENT[application.toLowerCase()]?.menu ?? null,
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