import type {Ref} from 'vue';
import {KeyboardEvent} from './enums';

export type Events = {
    [KeyboardEvent.INPUT]: {
        type: KeyboardEvent.INPUT,
        key: string
    },
    [KeyboardEvent.DELETE]: {
        type: KeyboardEvent.DELETE,
        key: string,
        side: 'left'|'right'
    },
    [KeyboardEvent.UNDO]: {
        type: KeyboardEvent.UNDO
    },
    [KeyboardEvent.SPACE]: {
        type: KeyboardEvent.SPACE,
        key: string
    },
    [KeyboardEvent.COMBO]: {
        type: KeyboardEvent.COMBO,
        key: string,
        ctrl: boolean,
        shift: boolean,
        alt: boolean,
        altGr: boolean
    },
    [KeyboardEvent.MOVE]: {
        type: KeyboardEvent.MOVE,
        key: string,
        side: 'up'|'down'|'left'|'right'
    },
    [KeyboardEvent.ENTER]: {
        type: KeyboardEvent.ENTER,
        key: string
    },
    [KeyboardEvent.NUMBER]: {
        type: KeyboardEvent.NUMBER,
        key: string
    },
    [KeyboardEvent.FUNCTION]: {
        type: KeyboardEvent.FUNCTION,
        key: string
    },
    [KeyboardEvent.PAGE]: {
        type: KeyboardEvent.PAGE,
        key: string,
        first: boolean,
        last: boolean,
        next: boolean,
        prev: boolean
    },
    [KeyboardEvent.HOME]: {
        type: KeyboardEvent.HOME,
        key: string
    },
    [KeyboardEvent.CLEAR]: {
        type: KeyboardEvent.CLEAR,
        key: string
    },
    [KeyboardEvent.OPERATOR]: {
        type: KeyboardEvent.OPERATOR,
        key: string
    },
    [KeyboardEvent.CUSTOM]: {
        type: KeyboardEvent.CUSTOM,
        key: string,
        composed: boolean,
        event: (globalThis.KeyboardEvent & {altGraphKey: boolean})|null
    },
    [KeyboardEvent.CUSTOM_ALL]: {
        type: KeyboardEvent.CUSTOM_ALL,
        key: string,
        composed: boolean,
        event: [globalThis.KeyboardEvent & {altGraphKey: boolean}]|null
    }
}

export type EventsOmitCustom = keyof Omit<
    Events,
    KeyboardEvent.CUSTOM | KeyboardEvent.CUSTOM_ALL
>;

export type ControlActions = {
    [K in EventsOmitCustom]: (
        e: globalThis.KeyboardEvent,
        composed: boolean,
        event: (event: Events[K]) => void
    ) => void
}

export type LastCharKey = Ref<string>;

export type KernelKeyboard = {
    listen<
        N extends (typeof KeyboardEvent)[keyof typeof KeyboardEvent],
        E extends Events[N]
    >(name: N, event: (event: E) => void): KernelKeyboard
};