import {computed, Ref, ref} from "vue";
import * as $commands from "@/commands";
import { commands as commandsPlugins } from '@/commands/plugins';
import type {ComputedRef} from "vue";
import type {TerminalCommand, TerminalCommandExecute} from "@/commands/types";
import {createSetter} from '@/commands/types';
import {useTerminalLineHeader} from '@/hooks/terminal/line-header.ts';

export const commands =
    Object.values($commands) as TerminalCommand[];

type UseCommandReturn = {
    proposedCommand: ComputedRef<string>,
    result: ComputedRef<string[]>,

    autocomplete(command: string): void,
    execute(): void
}

function preg_match(pattern: RegExp|string, input: string): Record<string, string|null>|RegExpExecArray|null {
    const regex = new RegExp(pattern);
    const match = regex.exec(input);

    return match !== null ? (match.groups ?? match) : null;
}

type UseCommands = (command: Ref<string>, terminalHistory: Ref<string[]>) => UseCommandReturn;

const getSelectedCommandResult = (cmd: string) => {
    let regex: RegExp|null = null;
    let isAdmin = false;
    let matchExecute: TerminalCommandExecute|null = null;

    for (const c of [...commands, ...commandsPlugins.value]) {
        const isAdminCommand = c.adminCommand && preg_match(c.adminCommand, cmd) !== null;
        const isNotAdminCommand = preg_match(c.command, cmd) !== null;

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
        const groups = preg_match(regex, cmd);
        return {regex, isAdmin, execute: matchExecute, groups: (typeof groups === 'object' ? groups : {})}
    }

    return null;
};

const migrateToArray = <T extends string|number|boolean|void>(p: T[]|T): string[] =>
    p ? (typeof p === 'object' ? p : [p]) : [] as any[]

export const useCommands: UseCommands = (command, terminalHistory) => {
    const proposedCommand = ref('');
    const result = ref<string[]>([]);

    const lineHeader = useTerminalLineHeader();

    const setResult = createSetter(result);
    const setCommand = createSetter(command);
    const setTerminalHistory = createSetter(terminalHistory);

    return {
        proposedCommand: computed(() => proposedCommand.value),
        result: computed(() => result.value),

        autocomplete(command: string) {
            console.log('complete', command)
        },
        execute() {
            const cmd = command.value;
            const selectedCommand = getSelectedCommandResult(cmd);

            if (selectedCommand) {
                const {
                    isAdmin, groups, execute
                } = selectedCommand;
                const setters = {
                    result: setResult,
                    command: setCommand,
                    terminalHistory: setTerminalHistory
                };
                const r = migrateToArray(execute((groups ?? {}), isAdmin, setters));

                if (r.length) {
                    setResult(r);
                    setTerminalHistory(h => [...h, lineHeader.value + cmd, ...r]);
                }
            }
            else {
                setResult([`command '${cmd}' not found`]);
                setTerminalHistory(th => [...th, lineHeader.value + cmd, ...result.value]);
                setCommand('');
            }
        }
    }
}