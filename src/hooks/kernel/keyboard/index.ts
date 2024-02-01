import {ComputedRef, toRef, ToRefs} from 'vue';
import {UnwrapRefSimple} from '@vue/reactivity'
import {onKeyDown, onKeyStroke, onKeyUp} from '@vueuse/core';
import {ref} from 'vue';
import {useKernel} from '@/hooks/kernel';
import type {Events, LastCharKey, ControlActions, KernelKeyboard} from './types';
import {KeyboardEvent} from './enums';
import {toComputed, ToMultiComputed} from '@/macros/vue.ts';

const eventsDefault: Events = {
    [KeyboardEvent.INPUT]: {
        type: KeyboardEvent.INPUT,
        key: ''
    },
    [KeyboardEvent.DELETE]: {
        type: KeyboardEvent.DELETE,
        key: '',
        side: 'left'
    },
    [KeyboardEvent.UNDO]: {
        type: KeyboardEvent.UNDO
    },
    [KeyboardEvent.SPACE]: {
        type: KeyboardEvent.SPACE,
        key: ''
    },
    [KeyboardEvent.COMBO]: {
        type: KeyboardEvent.COMBO,
        key: '',
        ctrl: false,
        shift: false,
        alt: false,
        altGr: false
    },
    [KeyboardEvent.MOVE]: {
        type: KeyboardEvent.MOVE,
        key: '',
        side: 'left'
    },
    [KeyboardEvent.ENTER]: {
        type: KeyboardEvent.ENTER,
        key: 'Enter',
    },
    [KeyboardEvent.NUMBER]: {
        type: KeyboardEvent.NUMBER,
        key: '',
    },
    [KeyboardEvent.FUNCTION]: {
        type: KeyboardEvent.FUNCTION,
        key: '',
    },
    [KeyboardEvent.PAGE]: {
        type: KeyboardEvent.PAGE,
        key: '',
        first: false,
        last: false,
        next: false,
        prev: false
    },
    [KeyboardEvent.HOME]: {
        type: KeyboardEvent.HOME,
        key: 'Home'
    },
    [KeyboardEvent.CLEAR]: {
        type: KeyboardEvent.CLEAR,
        key: 'Clear'
    },
    [KeyboardEvent.OPERATOR]: {
        type: KeyboardEvent.OPERATOR,
        key: ''
    },
    [KeyboardEvent.CUSTOM]: {
        type: KeyboardEvent.CUSTOM,
        key: '',
        composed: false,
        event: null
    },
    [KeyboardEvent.CUSTOM_ALL]: {
        type: KeyboardEvent.CUSTOM_ALL,
        key: '',
        composed: false,
        event: null
    },
};

const isAltGr = ref(false);
onKeyDown('AltGraph', () => {
    isAltGr.value = true;
});
onKeyUp('AltGraph', () => {
    isAltGr.value = false;
});

export const useKeyboard = <
    N extends (typeof KeyboardEvent)[keyof typeof KeyboardEvent]|(keyof typeof KeyboardEvent),
    E extends Events[N extends keyof typeof KeyboardEvent ? typeof KeyboardEvent[N] : N],
    Trigger extends (params: E) => void = (params: E) => void,
    Return = ToMultiComputed<E> & { watch: (name: string, trigger: Trigger) => void }
>(eventName: N): Return => {
    const { keyboard } = useKernel();
    const triggers = ref<Trigger[]>([]);

    const newEventName = Array.from(Object.keys(KeyboardEvent)).includes(eventName) ? KeyboardEvent[eventName as keyof typeof KeyboardEvent] : eventName as KeyboardEvent;

    const d: ToRefs<E> =
        Array.from(Object.keys(eventsDefault[newEventName]))
            .reduce(
                (r, c) => ({
                    ...r,
                    [c]: toRef((eventsDefault[newEventName] as ToRefs<E>)[c as keyof ToRefs<E>])
                }),
                {} as ToRefs<E>
            );

    keyboard.listen(newEventName, (e) => {
        for (const k in e) {
            (d[k as keyof ToRefs<E>].value as E[keyof E]) = (e as E)[k as keyof E];
        }
        triggers.value.map(trigger => trigger?.(e as E));
    });

    return {
        ...Array.from(Object.keys(d))
            .reduce<{ [K in keyof E]: ComputedRef<K> }>(
                (r, c) => ({
                    ...r,
                    [c]: toComputed((d as ToRefs<E>)[c as keyof ToRefs<E>])
                }),
                {} as { [K in keyof E]: ComputedRef<K> }
            ),
        watch(_n: string, watcher: Trigger) {
            triggers.value = [
                ...triggers.value,
                watcher as UnwrapRefSimple<Trigger>
            ];
        }
    } as Return;
}

const addAltGraphAndGetEvent = <
    E extends globalThis.KeyboardEvent & Partial<{altGraphKey: boolean}>,
    R extends Required<E>
>(e: E): R => {
    e.altGraphKey = isAltGr.value;

    return e as unknown as R;
}

const lastCharKey: LastCharKey = ref('');

const addAccents = (e: globalThis.KeyboardEvent) => {
    switch (e.key) {
        case 'E':
            if (e.shiftKey && ['^', '¨'].includes(lastCharKey.value)) {
                if (lastCharKey.value === '^') {
                    lastCharKey.value = '';
                    return 'Ê';
                }
                else if (lastCharKey.value === '¨') {
                    lastCharKey.value = '';
                    return 'Ë';
                }
            }
            break;
        case 'e':
            if (e.shiftKey && ['^', '¨'].includes(lastCharKey.value)) {
                if (lastCharKey.value === '^') {
                    lastCharKey.value = '';
                    return 'ê';
                }
                else if (lastCharKey.value === '¨') {
                    lastCharKey.value = '';
                    return 'ë';
                }
            }
            break;
        case 'A':
            if (e.shiftKey && ['^', '¨'].includes(lastCharKey.value)) {
                if (lastCharKey.value === '^') {
                    lastCharKey.value = '';
                    return 'Â';
                }
                else if (lastCharKey.value === '¨') {
                    lastCharKey.value = '';
                    return 'Ä';
                }
            }
            break;
        case 'a':
            if (e.shiftKey && ['^', '¨'].includes(lastCharKey.value)) {
                if (lastCharKey.value === '^') {
                    lastCharKey.value = '';
                    return 'â';
                }
                else if (lastCharKey.value === '¨') {
                    lastCharKey.value = '';
                    return 'ä';
                }
            }
            break;
        case 'I':
            if (e.shiftKey && ['^', '¨'].includes(lastCharKey.value)) {
                if (lastCharKey.value === '^') {
                    lastCharKey.value = '';
                    return 'Î';
                }
                else if (lastCharKey.value === '¨') {
                    lastCharKey.value = '';
                    return 'Ï';
                }
            }
            break;
        case 'i':
            if (e.shiftKey && ['^', '¨'].includes(lastCharKey.value)) {
                if (lastCharKey.value === '^') {
                    lastCharKey.value = '';
                    return 'î';
                }
                else if (lastCharKey.value === '¨') {
                    lastCharKey.value = '';
                    return 'ï';
                }
            }
            break;
        default: return e.key
    }
};

const controlActions: ControlActions = {
    [KeyboardEvent.UNDO](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.UNDO]) => void
    ) {
        if (composed && e.ctrlKey && ['z', 'Z'].includes(e.key)) {
            event({ type: KeyboardEvent.UNDO })
        }
    },
    [KeyboardEvent.NUMBER](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.NUMBER]) => void
    ) {
        if (
            (
                (
                    e.code.startsWith('Digit') &&
                    composed && e.shiftKey
                ) ||
                e.code.startsWith('Numpad')
            ) &&
            /^[0-9]+$/g.test(e.key)
        ) {
            event({
                type: KeyboardEvent.NUMBER,
                key: e.key
            })
        }
    },
    [KeyboardEvent.COMBO](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.COMBO]) => void
    ) {
        if (composed) {
            if (lastCharKey.value === '' && e.key === 'Dead') {
                lastCharKey.value = '¨';
                return;
            }

            if (
                (e.code.startsWith('Digit') && composed && e.shiftKey) ||
                (e.ctrlKey && ['z', 'Z'].includes(e.key))
            ) return;

            const key = addAccents(e);

            if (!key || key === '¨') return;

            event({
                type: KeyboardEvent.COMBO,
                key,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                altGr: isAltGr.value
            })
        }
    },
    [KeyboardEvent.SPACE](
        e: globalThis.KeyboardEvent,
        _composed: boolean,
        event: (event: Events[KeyboardEvent.SPACE]) => void
    ) {
        if (e.key === ' ') {
            event({
                type: KeyboardEvent.SPACE,
                key: e.key
            })
        }
    },
    [KeyboardEvent.DELETE](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.DELETE]) => void
    ) {
        if (!composed && (e.key === 'Backspace' || e.key === 'Delete')) {
            const side = e.key === 'Backspace' ? 'left' : 'right';

            event({
                type: KeyboardEvent.DELETE,
                key: e.key,
                side
            })
        }
    },
    [KeyboardEvent.MOVE](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.MOVE]) => void
    ) {
        if (
            !composed &&
            [
                'ArrowUp', 'ArrowDown',
                'ArrowLeft', 'ArrowRight'
            ].includes(e.key)
        ) {
            event({
                type: KeyboardEvent.MOVE,
                key: e.key,
                side: e.key.replace('Arrow', '').toLowerCase() as Events[KeyboardEvent.MOVE]['side']
            })
        }
    },
    [KeyboardEvent.INPUT](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.INPUT]) => void
    ) {
        if (!composed) {
            if (lastCharKey.value === '' && e.key === 'Dead') {
                lastCharKey.value = '^';
                return;
            }

            if (
                e.key.startsWith('Arrow') ||
                ['Backspace', 'Delete', 'Space'].includes(e.key) ||
                e.code.startsWith('Numpad') ||
                e.key === ' ' ||
                (e.keyCode >= 112 && e.keyCode <= 123)
            ) return;

            const key = addAccents(e);

            if (!key || key === '^') return;

            event({
                type: KeyboardEvent.INPUT,
                key
            })
        }
    },
    [KeyboardEvent.FUNCTION](
        e: globalThis.KeyboardEvent,
        _composed: boolean,
        event: (event: Events[KeyboardEvent.FUNCTION]) => void
    ) {
        if (e.keyCode >= 112 && e.keyCode <= 123) {
            event({
                type: KeyboardEvent.FUNCTION,
                key: e.key
            });
        }
    },
    [KeyboardEvent.ENTER](
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[KeyboardEvent.ENTER]) => void
    ) {
        if (!composed && e.key === 'Enter') {
            event({
                type: KeyboardEvent.ENTER,
                key: e.key
            })
        }
    },
    [KeyboardEvent.PAGE](
        e: globalThis.KeyboardEvent,
        _composed: boolean,
        event: (event: Events[KeyboardEvent.PAGE]) => void
    ) {
        if (
            e.key.startsWith('Page') ||
            ['Home', 'End'].includes(e.key)
        ) {
            event({
                type: KeyboardEvent.PAGE,
                key: e.key,
                ...((side) => ({
                    first: side === 'home',
                    last: side === 'end',
                    next: side === 'down',
                    prev: side === 'up'
                }))(e.key
                    .replace('Page', '')
                    .toLowerCase()
                )
            });
        }
    },
    [KeyboardEvent.HOME](
        e: globalThis.KeyboardEvent,
        _composed: boolean,
        event: (event: Events[KeyboardEvent.HOME]) => void
    ) {
        if (e.key === 'Home') {
            event({
                type: KeyboardEvent.HOME,
                key: e.key
            })
        }
    },
    [KeyboardEvent.CLEAR](
        e: globalThis.KeyboardEvent,
        _composed: boolean,
        event: (event: Events[KeyboardEvent.CLEAR]) => void
    ) {
        if (e.key === 'Clear') {
            event({
                type: KeyboardEvent.CLEAR,
                key: e.key
            })
        }
    },
    [KeyboardEvent.OPERATOR](
        e: globalThis.KeyboardEvent,
        _composed: boolean,
        event: (event: Events[KeyboardEvent.OPERATOR]) => void
    ) {
        if (['/', '*', '-', '+', '='].includes(e.key)) {
            event({
                type: KeyboardEvent.OPERATOR,
                key: e.key
            })
        }
    },
};

const listen = <
    N extends (typeof KeyboardEvent)[keyof typeof KeyboardEvent],
    E extends Events[N],
    Event extends (event: E) => void = (event: E) => void
>(name: N, event: Event) => {
    onKeyStroke(e => {
        const composed = (e.ctrlKey || e.shiftKey || e.altKey || isAltGr.value) && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'AltGraph' && e.key !== 'Shift';

        const isCompositionChar =
            ['Control', 'Shift', 'Alt', 'AltGraph'].includes(e.key) ||
            e.key.endsWith('Lock');
        const isAllCustom = name === KeyboardEvent.CUSTOM_ALL;
        const isCustom = name === KeyboardEvent.CUSTOM;

        if (isAllCustom || (!isCompositionChar && isCustom)) {
            event({
                type: isCustom ? KeyboardEvent.CUSTOM : KeyboardEvent.CUSTOM_ALL,
                key: e.key,
                composed,
                event: addAltGraphAndGetEvent(e)
            } as E)

            return this;
        }

        e.preventDefault();

        if (
            !['Control', 'Shift', 'Alt', 'AltGraph'].includes(e.key) &&
            !e.key.endsWith('Lock') &&
            name in controlActions
        ) {
            // @ts-expect-error
            controlActions[name].call(this, e, composed, event)
        }
    });

    return this;
}

export default { listen } as unknown as KernelKeyboard;