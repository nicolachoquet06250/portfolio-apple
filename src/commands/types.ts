import {ComputedRef, Ref} from 'vue';

type SetterParam<P> = ((p: P) => P) | P;
export type Setter<P> = (p: SetterParam<P>) => void;
type SetterCreator = <O>(obj: Ref<O>) => Setter<O>;

export const createSetter: SetterCreator = (obj) =>
    (results) =>
        (obj.value = typeof results === 'function'
            ? (results as Function)(obj.value) : results);

export type TerminalCommandExecute<
    G extends Record<string, string|null>|RegExpMatchArray =
            Record<string, string|null>|RegExpMatchArray,
    F extends {
        [K: string]: string|boolean|number|any[]
    } = {
        [K: string]: string|boolean|number|any[]
    },
    S extends Record<string, Setter<any>> = Record<string, Setter<any>>
> = (
    groups: G,
    isAdmin: boolean,
    flags: F,
    location: ComputedRef<string>,
    setters: S
) => string|string[]|void;

export type TerminalCommandFlag = {
    long?: string,
    short?: string,
    type: BooleanConstructor|StringConstructor|NumberConstructor|ArrayConstructor,
    value?: any,
    detectedFormat?: string,
    description?: string,
}

export type TerminalCommand = {
    command: RegExp;
    adminCommand?: RegExp;
    flags?: TerminalCommandFlag[];
    execute: TerminalCommandExecute;

    help?: () => string[];
    name?: string;
    description: string;
    usage: string;
}