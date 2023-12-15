import {computed, Ref, ref} from "vue";
import * as $commands from "@/commands";
import { commands as commandsPlugins } from '@/commands/plugins';
import type {ComputedRef} from "vue";
import type {TerminalCommand, TerminalCommandExecute} from "@/commands/types";
import {createSetter} from '@/commands/types';
import type {Setter} from '@/commands/types';
import {useTerminalLineHeader} from '@/hooks/terminal/line-header.ts';

export const commands =
    Object.values($commands) as TerminalCommand[];

type UseCommandReturn = {
    proposedCommand: ComputedRef<string|string[]>,
    result: ComputedRef<string[]>,

    autocomplete(command: string): void,
    execute(addToHistory: (command: string) => void): void
}

function preg_match(pattern: RegExp|string, input: string): Record<string, string|null>|RegExpExecArray|null {
    const regex = new RegExp(pattern);
    const match = regex.exec(input);

    return match !== null ? (match.groups ?? match) : null;
}

type UseCommands = (
    command: Ref<string>,
    terminalHistory: Ref<string[]>,
    location: [
        location: ComputedRef<string>,
        setLocation: Setter<string>
    ]
) => UseCommandReturn;

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

export const useCommands: UseCommands = (
    command,
    terminalHistory,
    [location, setLocation]
) => {
    const proposedCommand = ref<string|string[]>('');
    const result = ref<string[]>([]);

    const lineHeader = useTerminalLineHeader(location);

    const setResult = createSetter(result);
    const setCommand = createSetter(command);
    const setTerminalHistory = createSetter(terminalHistory);

    let lastTabPressTime = 0;
    let timeout: NodeJS.Timeout;

    return {
        proposedCommand: computed(() => proposedCommand.value),
        result: computed(() => result.value),

        autocomplete(command: string) {
            const items: TerminalCommand[] = [];
            for (const [name, cmd] of Object.entries($commands) as [name: string, cmd: TerminalCommand][]) {
                if ((cmd.name && cmd.name.startsWith(command)) || name.startsWith(command)) {
                    items.push({
                        ...cmd,
                        name: (cmd.name ?? name)
                    });
                }
            }

            const currentTime = Date.now();

            if (currentTime - lastTabPressTime < 300) {
                // double tab
                proposedCommand.value =
                    items.map(item => item.name!);
                setTerminalHistory(th => [
                    ...th,
                    lineHeader.value + command,
                    items.map(item => item.name!)
                        .join(Array.from(new Array(5)).map(() => '&nbsp;').join(''))
                ])

                clearTimeout(timeout);

                lastTabPressTime = 0;
            } else {
                // simple tab
                lastTabPressTime = currentTime;

                timeout = setTimeout(() => {
                    if (items.length === 1) {
                        proposedCommand.value = items[0].name!;
                        setCommand(c => c + items[0].name!.substring(c.length))
                    }
                }, 300)
            }
        },
        execute(addToHistory) {
            const cmd = command.value;
            const selectedCommand = getSelectedCommandResult(cmd);

            if (selectedCommand) {
                const {
                    isAdmin, groups, execute
                } = selectedCommand;
                const setters = {
                    result: setResult,
                    command: setCommand,
                    terminalHistory: setTerminalHistory,
                    location: setLocation
                };
                const oldLineHeader = lineHeader.value;
                const r = migrateToArray(execute((groups ?? {}), isAdmin, location, setters));

                if (r.length) {
                    setResult(r);
                    setTerminalHistory(h => [...h, oldLineHeader + cmd, ...r]);
                }
                setCommand('');
            }
            else {
                setResult([`command '${cmd}' not found`]);
                setTerminalHistory(th => [...th, lineHeader.value + cmd, ...result.value]);
                setCommand('');
            }
            addToHistory(cmd)
        }
    }
};

type UseCommandHistory = () => [
    history: ComputedRef<string[]>,
    currentHistoryIndex: ComputedRef<number>,
    addToHistory: (command: string) => void,
    setIndex: (index: ((i: number) => number)|number) => void,
    currentHistoryCommand: ComputedRef<string|null>
]

export const useCommandHistory: UseCommandHistory = () => {
    const history = ref<string[]>([]);
    const currentHistoryIndex = ref<number>(-1);

    return [
        computed(() => history.value),
        computed(() => currentHistoryIndex.value),
        (c) => (history.value = [c, ...history.value]),
        (index) => {
            currentHistoryIndex.value = typeof index === 'function' ?
                index(currentHistoryIndex.value) : index;
        },
        computed(() => history.value[currentHistoryIndex.value] ?? null)
    ];
};