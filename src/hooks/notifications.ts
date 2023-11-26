import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue'

type Queue = {
    image: string;
    title: string;
    content: string;
    opened: boolean;
    buttons: {
        text: string;
        click: (e: Event) => void;
    }[]
    id: number;
    index: number;
}

const queue = ref<Queue[]>([]);

export const useNotifications = () => ({
    notifications: computed(() => queue.value),

    createNotification(notification: Omit<Queue, 'opened'> & {opened: ComputedRef<boolean>}) {
        queue.value = [
            ...queue.value,
            {
                ...notification,
                opened: notification.opened.value,
                index: notification.index ?? (queue.value.length === 0 ? 0 : queue.value[queue.value.length - 1].index + 1),
                id: queue.value.length === 0 ? 0 : queue.value[queue.value.length - 1].id + 1
            }
        ]
    },
    deleteNotification(id: number) {
        queue.value = queue.value.reduce<Queue[]>((r, c) => {
            if (c.id === id) {
              return [
                ...r,
                { ...c, opened: false }
              ];
            }
            return [...r, c];
          }, []);
    },
    closeNotification(index: number) {
        queue.value = queue.value.reduce<{ i: number, t: Queue[] }>((r, c) => {
            if (r.i !== index) {
              return {
                i: r.i + 1,
                t: [
                    ...r.t, {
                    ...c,
                    index: (c.index > index ? c.index - 1 : c.index)
                    }
                ]
              }
            }
            return {
              t: [...r.t, c],
              i: r.i + 1
            };
          }, { i: 0, t: []}).t;
    }
});