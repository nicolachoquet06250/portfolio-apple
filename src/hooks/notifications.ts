import {ref, computed, ComputedRef, Ref, watch} from 'vue';

const queue = ref<MacOsNotification[]>([]);

watch(queue, queue => {
    console.log(queue, 6)
})

type NotificationAction = {
    text: string,
    click(e?: MouseEvent): void
}

type MacOsNotification = {
    index: number,
    id: number,
    image: string,
    title: string,
    content: string,
    opened: ComputedRef<boolean>|Ref<boolean>,
    buttons: NotificationAction[]
};

export const useNotifications = () => ({
    notifications: computed(() => queue.value),

    createNotification<T extends Omit<MacOsNotification, 'id'|'index'> & {id?: number, index?: number}>(notification: T) {
        // @ts-expect-error
        queue.value = [
            ...queue.value,
            {
                ...notification,
                index: notification.index ??
                    (queue.value.length === 0
                        ? 0 : (queue.value[queue.value.length - 1].index ?? 0) + 1),
                id: queue.value.length === 0
                    ? 0 : (queue.value[queue.value.length - 1].id ?? 0) + 1
            }
        ] as unknown as MacOsNotification[]
    },
    deleteNotification(id: number) {
        // @ts-expect-error
        queue.value = queue.value.reduce((r, c) => {
            if (c.id === id) {
                return [
                    ...r,
                    {
                        ...c,
                        opened: computed(() => false)
                    }
                ];
            }
            return [...r, c];
        }, []) as unknown as MacOsNotification[];
    },
    closeNotification(index: number) {
        type Reducer = {
            t: MacOsNotification[],
            i: number
        };

        // @ts-expect-error
        queue.value = queue.value.reduce<Reducer>((r, c) => {
            if (r.i === index) {
                return {
                    t: [
                        ...(r.t ?? []),
                        c
                    ],
                    i: r.i + 1
                };
            }

            return {
                i: r.i + 1,
                t: [
                    ...(r.t ?? []),
                    {
                        ...c,
                        index: (c.index > index ? c.index - 1 : c.index)
                    }
                ]
            };
            // @ts-expect-error
        }, { i: 0, t: []}).t;
        console.log(queue.value, 86)
    },
    cleanNotifications() {
        queue.value = [];
    },
    removeNotification(i: number) {
        console.log(i, 92)
        queue.value = queue.value.filter((_, index) => index !== i);
    }
});