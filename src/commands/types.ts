import {Ref} from 'vue';

type SetterParam<P> = ((p: P) => P) | P;
export type Setter<P> = (p: SetterParam<P>) => void;
type SetterCreator = <O>(obj: Ref<O>) => Setter<O>;

export const createSetter: SetterCreator = (obj) =>
    (results) =>
        (obj.value = typeof results === 'function'
            ? (results as Function)(obj.value) : results);

export type TerminalCommandExecute<
    G extends Record<string, string|null>|RegExpMatchArray = Record<string, string|null>|RegExpMatchArray
> = (
    groups: G,
    isAdmin: boolean,
    setters: {
        result: Setter<string[]>,
        command: Setter<string>,
        terminalHistory: Setter<string[]>
    }
) => string|string[]|void;

export type TerminalCommand = {
    command: RegExp;
    adminCommand?: RegExp;
    execute: TerminalCommandExecute;
}