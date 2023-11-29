import {useBroadcastChannel} from "@vueuse/core";
// import {useSystemLoading} from "@/hooks/system-loading.js";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useUuid} from "@/hooks/uuid.js";

const screens = ref([]);

export const useScreens = () => {
    // const { systemLoading } = useSystemLoading();
    const { post, data } = useBroadcastChannel(({name: 'multi-screen'}));
    const uuid = useUuid();

    const screenDetailsSupported = ref(false);
    /** @type {import('vue').Ref<ScreenDetails|null>} */
    const screenDetails = ref(null);
    const screenNumber = computed(() => {
        if (screenDetailsSupported.value) {
            return screenDetails.value.screens
                .indexOf(screenDetails.value.currentScreen);
        }

        return screens.value.indexOf(uuid.value);
    });
    const listeners = reactive({});

    onMounted(() => {
        if ('getScreenDetails' in window) {
            /** @var {Promise<ScreenDetails>} details */
            const details = window.getScreenDetails();

            details.then(d => {
                screenDetails.value = d;
                screenDetailsSupported.value = true;
            }).catch(() => {
                screenDetailsSupported.value = false;
            }).finally(() => {
                /** @type {string} data */
                const data = screenDetailsSupported.value
                    ? screenDetails.value.currentScreen.label : uuid.value;

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
                    ? screenDetails.value.currentScreen.label : uuid.value;

                post?.(JSON.stringify({
                    channel: 'unregister',
                    data: data
                }));
            } catch (_) {}
        })
    });

    watch(data, (data) => {
        try {
            data = JSON.parse(data);

            switch(data.channel) {
                case 'register':
                    /** @type {string} _data */
                    const _data = screenDetailsSupported.value
                        ? screenDetails.value.currentScreen.label : uuid.value;

                    if (screens.value.filter(s =>
                        s === data.data).length === 0) {
                        screens.value = [...screens.value, data.data];
                    }

                    post?.(JSON.stringify({
                        channel: 'register',
                        data: _data
                    }));
                    break;
                case 'unregister':
                    screens.value = [
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

    const _post = (channel, data = {}) => post?.(JSON.stringify({channel, data}));

    return {
        supported: computed(() => screenDetailsSupported.value),
        screenNumber,
        isMultiScreen: computed(() => screens.value.length > 1),
        post: _post,
        on(channel, cb = () => {}) {
            listeners[channel] = cb;
        }
    };
};