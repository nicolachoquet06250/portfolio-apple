import {computed, Ref, ref} from "vue";
import * as $commands from "@/commands";
import type {ComputedRef} from "vue";
import type {TerminalCommand, TerminalCommandExecute} from "@/commands/types";
import {createSetter} from '@/commands/types';

export const commands =
    Object.values($commands) as TerminalCommand[];

type UseCommandReturn = {
    proposedCommand: ComputedRef<string>,
    result: ComputedRef<string[]>,

    autocomplete(command: string): void,
    execute(): void
}

function preg_match(pattern: RegExp|string, input: string): Record<string, string>|null {
    const regex = new RegExp(pattern);
    const match = regex.exec(input);

    return match !== null ? (match.groups ?? null) : null;
}

type UseCommands = (command: Ref<string>) => UseCommandReturn;

export const useCommands: UseCommands = (_command) => {
    const proposedCommand = ref('');
    const result = ref<string[]>([]);

    const setResult = createSetter(result);
    const setCommand = createSetter(_command);

    return {
        proposedCommand: computed(() => proposedCommand.value),
        result: computed(() => result.value),

        autocomplete(command: string) {
            console.log('complete', command)
        },
        execute() {
            let regex: RegExp|null = null;
            let isAdmin = false;
            let matchExecute: TerminalCommandExecute|null = null;

            for (const c of commands) {
                const isAdminCommand = c.adminCommand && c.adminCommand.test(_command.value);
                const isNotAdminCommand = c.command.test(_command.value);

                if (isAdminCommand) {
                    regex = c.adminCommand!;
                    isAdmin = true;
                    matchExecute = c.execute;
                    break;
                }
                else if (isNotAdminCommand) {
                    regex = c.command;
                    isAdmin = false;
                    matchExecute = c.execute;
                    break;
                }
            }

            if (regex && matchExecute) {
                const groups = preg_match(regex, _command.value);
                const r = matchExecute((groups ?? {}), isAdmin, setResult, setCommand);

                setResult(typeof r === 'string' ? [r] : r);
            }
            else {
                setCommand('');
                setResult([`command '${_command.value}' not found`])
                console.log(`command '${_command.value}' not found`)
            }
        }
    }
}