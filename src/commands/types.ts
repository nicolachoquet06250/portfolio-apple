import {Ref} from 'vue';

type SetterParam<P> = ((p: P) => P) | P;
export type Setter<P> = (p: SetterParam<P>) => void;
type SetterCreator = <O>(obj: Ref<O>) => Setter<O>;

export const createSetter: SetterCreator = (obj) =>
    (results) =>
        (obj.value = typeof results === 'function'
            ? (results as Function)(obj.value) : results);

export type TerminalCommandExecute<
    G extends Record<string, string|null> = Record<string, string|null>
> = (groups: G, isAdmin: boolean, setResult: Setter<string[]>, setCommand: Setter<string>) => string|string[];

export type TerminalCommand = {
    command: RegExp;
    adminCommand?: RegExp;
    execute: TerminalCommandExecute;
}