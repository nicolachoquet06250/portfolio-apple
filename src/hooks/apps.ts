import {reactive, ref, computed, watch, Component, Ref, DefineComponent} from 'vue';
import {useMousePressed, useMouse, useWindowSize, onClickOutside} from '@vueuse/core';

import FinderApp from '@/applications/Finder.vue';
import StoreApp from '@/applications/Store.vue';
import MailsApp from '@/applications/Mail.vue';
import MessagesApp from '@/applications/Messages.vue';
import SettingsApp from '@/applications/Settings.vue';
import TerminalApp from '@/applications/Terminal';
import TrashApp from '@/applications/Trash.vue';
import PhotosApp from '@/applications/Photos.vue';
import TextEditApp from '@/applications/TextEdit.vue';

import FinderHeader from '@/applications/header/Finder.vue';
import StoreHeader from '@/applications/header/Store.vue';
import MailsHeader from '@/applications/header/Mail.vue';
import MessagesHeader from '@/applications/header/Messages.vue';
import SettingsHeader from '@/applications/header/Settings.vue';
import TerminalHeader from '@/applications/header/Terminal.vue';
import TrashHeader from '@/applications/header/Trash.vue';
import PhotosHeader from '@/applications/header/Photos.vue';
import TextEditHeader from '@/applications/header/TextEdit.vue';

import FinderMenu from '@/applications/menu/Finder.vue';
import StoreMenu from '@/applications/menu/Store.vue';
import MailsMenu from '@/applications/menu/Mail.vue';
import PhotosMenu from '@/applications/menu/Photos.vue';
import TextEditMenu from '@/applications/menu/TextEdit.vue';

export enum APPLICATION {
    FINDER = 'finder',
    STORE = 'appstore',
    MAILS = 'mail',
    MESSAGES = 'messages',
    SETTINGS = 'preferences',
    TERMINAL = 'terminal',
    TRASH = 'trash',
    PHOTOS = 'photos',
    TEXTEDIT = 'textedit'
}

export enum APPLICATION_STATE {
    CLOSED = 'closed',
    OPENED = 'opened',
    IN_DOCK = 'in_dock'
}

type ApplicationComponent = Record<APPLICATION, {
    body: Component|DefineComponent,
    header?: Component|DefineComponent,
    menu?: Component|DefineComponent,
}>

export const APPLICATION_COMPONENT: ApplicationComponent = {
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
    },
    [APPLICATION.TEXTEDIT]: {
        body: TextEditApp,
        header: TextEditHeader,
        menu: TextEditMenu
    }
};

const currentApp = ref<APPLICATION|null>(null);
const currentAppMenus = reactive<Record<string, any>>({});

type ApplicationDetail = {
    full_screen: boolean,
    name: string,
    state: APPLICATION_STATE,
    // component: Component|null,
    // componentHeader: Component|null,
    // componentMenu: Component|null,
    size: {
        width: number,
        height: number
    },
    position: {
        x: number,
        y: number
    }
}

const openedApplications = reactive<
    Partial<Record<APPLICATION, Partial<ApplicationDetail>>>
>({});
const applicationsHistory = ref<APPLICATION[]>([]);

const lastApplicationOpened = computed(() => applicationsHistory.value.length === 1
    ? 'finder' : applicationsHistory.value[applicationsHistory.value.length - 1]);

const DISABLED_MOVABLE_HEADER_TAGS = ['a', 'i', 'button', 'input', 'label'];

const setCurrentAppSize = (width: number, height: number) => {
    openedApplications[currentApp.value!]!.size = { width, height };
};

const setCurrentAppPosition = (x: number, y: number) => {
    openedApplications[currentApp.value!]!.position = { x, y };
};

const setCurrentApp = (_currentApp: APPLICATION|null) => {
    currentApp.value = _currentApp;
};

const closeApplication = (application: APPLICATION) => {
    openedApplications[application.toLowerCase() as APPLICATION]!.state = APPLICATION_STATE.CLOSED;

    if (application.toLowerCase() !== APPLICATION.FINDER) {
        applicationsHistory.value = applicationsHistory.value.reduce<APPLICATION[]>((r, c) =>
            c === application.toLowerCase() ? r : [...r, c], []);
    }
};

export const useAppActions = (
    application: Ref<HTMLElement|null>,
    code: APPLICATION,
    opened: Ref<boolean>
) => {
    /**
     * Reactives variables
     */
    
    const currentSize = reactive({
        width: openedApplications[code]!.size?.width ?? 0,
        height: openedApplications[code]!.size?.height ?? 0
    });
    const currentPosition = reactive({
        x: openedApplications[code]!.position?.x ?? 0,
        y: openedApplications[code]!.position?.y ?? 0
    });
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

    const applicationHeader = ref<HTMLElement|null>(null);

    const applicationResizerLeft = ref<HTMLElement|null>(null);
    const applicationResizerRight = ref<HTMLElement|null>(null);
    const applicationResizerTop = ref<HTMLElement|null>(null);
    const applicationResizerBottom = ref<HTMLElement|null>(null);

    const headerPressed = ref(false);
    const isOutside = ref(false);

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
    onClickOutside(application, () => (isOutside.value = true));
    const { pressed: pressInside } = useMousePressed({target: application});
    watch(pressInside, (pressInside) => pressInside && (isOutside.value = false));

    const resize = ({ width, height }: ApplicationDetail['size']) => {
        currentSize.width = width;
        currentSize.height = height;
    };

    const move = ({ x, y }: ApplicationDetail['position']) => {
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
                y: (mouseY.value - (applicationHeader.value!.offsetHeight / 2) > 0
                    ? mouseY.value - applicationHeader.value!.offsetHeight : 0)
            });
        }

        if (mousePressed.resize) {
            if (mousePressed.resizeSens === 'right') {
                resize({
                    width: currentSize.width + (mouseX.value - oldMouseX), 
                    height: currentSize.height
                });

                if (currentSize.width === application.value!.offsetWidth) {
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
        
                if (application.value!.offsetWidth === parseInt(application.value!.style.minWidth.replace('px', '')) && mouseX.value > onClickMousePosition.x) {
                    mousePressed.resizeSens = '';
                }
            }
        
            if (mousePressed.resizeSens === 'bottom') {
                resize({
                    height: currentSize.height + (mouseY.value - oldMouseY), 
                    width: currentSize.width
                });
                
                if (currentSize.height === application.value!.offsetHeight) {
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
                
                if (currentSize.height === application.value!.offsetHeight) {
                    mousePressed.resize = false;
                    mousePressed.resizeSens = '';
                }
            }

            if (mousePressed.resize && application.value!.offsetWidth >= windowWidth.value) {
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

    watch([() => openedApplications[code]!.size?.width, () => openedApplications[code]!.size?.height], ([width, height]) => {
        resize({
            width: width ?? 0,
            height: height ?? 0
        });
    });

    watch([() => openedApplications[code]?.position?.x, () => openedApplications[code]?.position?.y], ([x, y]) => {
        move({
            x: x ?? 0,
            y: y ?? 0
        });
    });

    watch(applicationHeader, () => {
        if (applicationHeader.value) {
            applicationHeader.value.addEventListener('mousedown', (e) => {
                if (DISABLED_MOVABLE_HEADER_TAGS.indexOf((e.target as HTMLElement).tagName.toLowerCase()) === -1 && !(e.target as HTMLElement).hasAttribute('clickable')) {
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
        bodyHeight: computed(() => (currentSize.height - (applicationHeader.value?.offsetHeight ?? 0) - 20) + 'px'),
        headerPressed: computed(() => headerPressed.value),
        isOutside: computed(() => isOutside.value),

        move,
        resize,
        closeApp() {
            close.value = true;
    
            const animationend = () => {
                setTimeout(() => {
                    opened.value = false;
                    closeApplication(code);
                    setTimeout(() => setCurrentApp(lastApplicationOpened.value as APPLICATION), 1000);
                    close.value = false;

                    move({
                        x: 0, 
                        y: 0
                    });
                    resize({
                        width: 777, 
                        height: 313
                    });
                }, 1000);

                application.value!.removeEventListener('animationend', animationend);
            };

            application.value!.addEventListener('animationend', animationend);
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

    openApplication(application: APPLICATION) {
        if (openedApplications[application]) {
            openedApplications[application]!.state = APPLICATION_STATE.OPENED;
        } else {
            // console.log(
            //     APPLICATION_COMPONENT[application.toLowerCase() as APPLICATION]?.body,
            //     APPLICATION_COMPONENT[application.toLowerCase() as APPLICATION]?.header,
            //     APPLICATION_COMPONENT[application.toLowerCase() as APPLICATION]?.menu
            // )
            openedApplications[application] = {
                state: APPLICATION_STATE.OPENED,
                full_screen: false,
                name: application.substring(0, 1).toUpperCase() + application.substring(1, application.length),
                // component: APPLICATION_COMPONENT[application]?.body,
                // componentHeader: APPLICATION_COMPONENT[application]?.header ?? null,
                // componentMenu: APPLICATION_COMPONENT[application]?.menu ?? null,
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

        applicationsHistory.value = [
            ...applicationsHistory.value,
            application.toLowerCase() as APPLICATION
        ];
    },

    applicationToDock(application: APPLICATION) {
        openedApplications[application.toLowerCase() as APPLICATION] = {
            ...(openedApplications[application.toLowerCase() as APPLICATION] ?? {}),
            state: APPLICATION_STATE.IN_DOCK
        }
        if (application.toLowerCase() !== APPLICATION.FINDER) {
            applicationsHistory.value = applicationsHistory.value.reduce<APPLICATION[]>((r, c) =>
                c === application.toLowerCase() ? r : [...r, c], []);
        }
    },

    maximizeApplication(application: APPLICATION) {
        openedApplications[application.toLowerCase() as APPLICATION] = {
            ...(openedApplications[application.toLowerCase() as APPLICATION] ?? {}),
            state: APPLICATION_STATE.OPENED,
            full_screen: true
        }

        if (applicationsHistory.value.indexOf(application.toLowerCase() as APPLICATION) === -1) {
            applicationsHistory.value = [
                ...applicationsHistory.value,
                application.toLowerCase() as APPLICATION
            ];
        }
    },

    minifyApplication(application: APPLICATION) {
        openedApplications[application.toLowerCase() as APPLICATION] = {
            ...(openedApplications[application.toLowerCase() as APPLICATION] ?? {}),
            state: APPLICATION_STATE.OPENED,
            full_screen: false
        }

        if (applicationsHistory.value.indexOf(application.toLowerCase() as APPLICATION) === -1) {
            applicationsHistory.value = [
                ...applicationsHistory.value,
                application.toLowerCase() as APPLICATION
            ];
        }
    },

    closeApplication,

    initApplicationHistory() {
        applicationsHistory.value = [APPLICATION.FINDER];
    }
});

export const useApplicationBodyComponent = (application: APPLICATION) => {
    return computed(() => APPLICATION_COMPONENT[application]?.body ?? null);
};
export const useApplicationHeaderComponent = (application: APPLICATION) => {
    return computed(() => APPLICATION_COMPONENT[application]?.header ?? null);
};
export const useApplicationMenuComponent = (application: APPLICATION) => {
    return computed(() => APPLICATION_COMPONENT[application]?.menu ?? null);
};
export const useApplicationState = (application: APPLICATION) => computed<APPLICATION_STATE>(() => openedApplications[application]!.state!);
export const useApplicationFullScreen = (application: APPLICATION) => computed<boolean>(() => openedApplications[application]!.full_screen ?? false);
export const useApplicationName = (application: APPLICATION) => computed<string>(() => openedApplications[application]!.name!);
export const useApplicationSize = (application: APPLICATION) => computed<{width: number, height: number}>(() => openedApplications[application]!.size!);
export const useApplicationPosition = (application: APPLICATION) => computed<{x: number, y: number}>(() => openedApplications[application]!.position!);
