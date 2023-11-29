import { ref, computed } from 'vue';

const queue = ref([]);

export const useNotifications = () => ({
    notifications: computed(() => queue.value),

    createNotification(notification) {
        queue.value = [
            ...queue.value,
            {
                ...notification,
                index: notification.index ?? (queue.value.length === 0 ? 0 : queue.value[queue.value.length - 1].index + 1),
                id: queue.value.length === 0 ? 0 : queue.value[queue.value.length - 1].id + 1
            }
        ]
    },
    deleteNotification(id) {
        queue.value = queue.value.reduce((r, c) => {
            if (c.id === id) {
              return [
                ...r, 
                { ...c, opened: false }
              ];
            }
            return [...r, c];
          }, []);
    },
    closeNotification(index) {
        queue.value = queue.value.reduce((r, c) => {
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
    },
    cleanNotifications() {
        queue.value = [];
    }
});