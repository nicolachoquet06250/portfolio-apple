import {useBroadcastChannel} from "@vueuse/core";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useUuid} from "@/hooks/uuid";

declare global {
    interface ScreenDetails {
        currentScreen: any,
        screens: any[]
    }

    interface Window {
        getScreenDetails(): Promise<ScreenDetails>
    }
}

const screens = ref<any[]>([]);

type Channel = {
    channel: string,
    data: any
};

export const useScreens = () => {
    // const { systemLoading } = useSystemLoading();
    const { post, data } = useBroadcastChannel<
        Channel|string,
       string
    >(({name: 'multi-screen'}));
    const uuid = useUuid();

    const screenDetailsSupported = ref(false);
    const screenDetails = ref<ScreenDetails|null>(null);
    const screenId = computed(() => {
        if (screenDetailsSupported.value) {
            return screenDetails.value?.screens
                .indexOf(screenDetails.value?.currentScreen);
        }

        const id = screens.value.indexOf(uuid.value);
        return id === -1 ? 0 : id;
    });
    const screenNumber = computed(() => {
        if (screenDetailsSupported.value) {
            return screenDetails.value?.screens.length ?? 0;
        }

        return screens.value.length;
    })
    const listeners = reactive<{[k: string]: any}>({});

    onMounted(() => {
        if ('getScreenDetails' in window) {
            const details = window.getScreenDetails();

            details.then(d => {
                screenDetails.value = d;
                screenDetailsSupported.value = true;
            }).catch(() => {
                screenDetailsSupported.value = false;
            }).finally(() => {
                const data = screenDetailsSupported.value
                    ? screenDetails.value?.currentScreen.label ?? '' : uuid.value;

                if (screens.value.filter(s => s === data).length === 0) {
                    screens.value = [...screens.value, data];
                }
                post?.(JSON.stringify({
                    channel: 'register',
                    data
                }));
            });
        }

        window.addEventListener('beforeunload', () => {
            console.log('close')

            try {
                /** @type {string} data */
                const data = screenDetailsSupported.value
                    ? screenDetails.value?.currentScreen.label ?? '' : uuid.value;

                post?.(JSON.stringify({
                    channel: 'unregister',
                    data: data
                }));
            } catch (_) {}
        })
    });

    watch(data, (data) => {
        try {
            data = (typeof data === 'string' ? JSON.parse(data) : data) as Channel;

            switch(data.channel) {
                case 'register':
                    const _data = screenDetailsSupported.value
                        ? screenDetails.value!.currentScreen.label : uuid.value;

                    // @ts-expect-error
                    if (screens.value.filter(s => s === data.data).length === 0) {
                        screens.value = [...screens.value, data.data];
                    }

                    post?.(JSON.stringify({
                        channel: 'register',
                        data: _data
                    }));
                    break;
                case 'unregister':
                    screens.value = [
                        // @ts-expect-error
                        ...screens.value.filter(s => s !== data.data)
                    ];
                    break
                default:
                    for (const listener of Object.keys(listeners)) {
                        if (data.channel === listener) {
                            listeners[listener].call(null, data.data)
                        }
                    }
                    break;
            }
        }
        catch (_) {
            if (listeners['message']) {
                listeners['message'](data);
            }
        }
    });

    watch(screens, (screens) => {
        console.log(screens)
    });

    const _post = (channel: string, data = {}) => post?.(JSON.stringify({channel, data}));

    return {
        supported: computed(() => screenDetailsSupported.value),
        screenId,
        screenNumber,
        isMultiScreen: computed(() => screens.value.length > 1),
        post: _post,
        on(channel: string, cb = () => {}) {
            listeners[channel] = cb;
        }
    };
};