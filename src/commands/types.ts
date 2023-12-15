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
    S extends Record<string, Setter<any>> = Record<string, Setter<any>>
> = (
    groups: G,
    isAdmin: boolean,
    location: ComputedRef<string>,
    setters: S
) => string|string[]|void;

export type TerminalCommand = {
    command: RegExp;
    adminCommand?: RegExp;
    name?: string;
    execute: TerminalCommandExecute;
}