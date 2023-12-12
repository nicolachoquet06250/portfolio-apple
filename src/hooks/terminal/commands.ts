import {computed, ref} from "vue";
import type {ComputedRef, Ref} from "vue";

type TerminalCommandExecute = (
    groups: Record<string, string|null>,
    isAdmin: boolean
) => string;

type TerminalCommand = {
    command: RegExp;
    adminCommand?: RegExp;
    execute: TerminalCommandExecute;
}

export const commands: TerminalCommand[] = [
    {
        command: /cd (?<source>[a-zA-Z0-9_\-/]+) (?<dist>[a-zA-Z0-9_\-/]+)/g,
        adminCommand: /sudo cd (?<source>[a-zA-Z0-9_\-/]+) (?<dist>[a-zA-Z0-9_\-/]+)/g,
        // @ts-expect-error
        execute({source, dist}, isAdmin) {
            return '';
        }
    }
];

type UseCommandReturn = {
    proposedCommand: ComputedRef<string>,
    autocomplete(): void,
    execute(): void
}

type UseCommands = (command: Ref<string>|ComputedRef<string>) => UseCommandReturn;

export const useCommands: UseCommands = (command) => {
    const proposedCommand = ref('');

    return {
        proposedCommand: computed(() => proposedCommand.value),
        autocomplete() {
            console.log('complete')
        },
        execute() {
            console.log(command.value)
        }
    }
}