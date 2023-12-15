import {computed, Ref, ref} from "vue";
import * as $commands from "@/commands";
import { commands as commandsPlugins } from '@/commands/plugins';
import type {ComputedRef} from "vue";
import type {TerminalCommand, TerminalCommandExecute, TerminalCommandFlag} from "@/commands/types";
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

function preg_match_all(pattern: RegExp|string, input: string): Record<string, string>[] {
    if (typeof pattern === 'string') {
        pattern = new RegExp(pattern);
    }
    let m;

    const matches: Record<string, string>[] = [];

    while ((m = pattern.exec(input)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === pattern.lastIndex) {
            pattern.lastIndex++;
        }

        const groups = m.groups ?? {};
        matches.push(groups as Record<string, string>);
    }

    return matches;
}

type UseCommands = (
    command: Ref<string>,
    terminalHistory: Ref<string[]>,
    location: [
        location: ComputedRef<string>,
        setLocation: Setter<string>
    ]
) => UseCommandReturn;

const getFlags = (flags: TerminalCommandFlag[], matched: string) =>
    flags.map<TerminalCommandFlag>((flag) => {
        let regex: RegExp;

        if (flag.type.name === 'Boolean') {
            regex = flag.short ?
                new RegExp(`--(?<long>${flag.long})|-(?<short>${flag.short}) `, 'gm') :
                new RegExp(`--(?<long>${flag.long}) `, 'gm');

            const match = preg_match(regex, matched) as {flag: string, long?: string, short?: string, value: string}|null;
            flag.value = match !== null;

            if (match !== null) {
                flag.detectedFormat = match.short ?? match.long;
            }

            return flag;
        }
        else if (flag.type.name === 'String') {
            regex = flag.short ?
                new RegExp(`(?<flag>-{2}(?<long>${flag.long})|-(?<short>${flag.short}))([= ])(?<value>([a-zA-Z0-9-_\/.]+|'[a-zA-Z0-9-_/. ]*'))`, 'gm') :
                new RegExp(`(?<flag>-{2}(?<long>${flag.long}))([= ])(?<value>([a-zA-Z0-9-_\/.]+|'[a-zA-Z0-9-_\/. ]*'))`, 'gm');

            const match = preg_match(regex, matched) as {flag: string, long?: string, short?: string, value: string}|null;
            if (match !== null) {
                flag.value = match.value.includes(' ') && match.value.startsWith('\'') && match.value.endsWith('\'') ? match.value.substring(1, match.value.length - 1) : match.value;
                flag.detectedFormat = match.short ?? match.long;
            }

            return flag;
        }
        else if (flag.type.name === 'Number') {
            regex = flag.short ?
                new RegExp(`(?<flag>-{2}(?<long>${flag.long})|-(?<short>${flag.short}))([= ])(?<value>([0-9]+(\.[0-9]+)?)|([a-zA-Z0-9-_.]+|'[a-zA-Z0-9-_. ]*'))`, 'gm') :
                new RegExp(`(?<flag>-{2}(?<long>${flag.long}))([= ])(?<value>([0-9]+(\.[0-9]+)?)|([a-zA-Z0-9-_.]+|'[a-zA-Z0-9-_. ]*'))`, 'gm');

            const match = preg_match(regex, matched) as {flag: string, long?: string, short?: string, value: string}|null;
            if (match !== null) {
                flag.value = preg_match(/^[0-9]+.?[0-9]*$/g, match.value) !== null && !match.value.startsWith('0') ?
                    (match.value.includes('.') ?
                            parseFloat(match.value) :
                            parseInt(match.value)
                    ) : match.value;
            }

            return flag;
        }

        regex = flag.short ?
            new RegExp(`(?<flag>-{2}(?<long>${flag.long})|-(?<short>${flag.short}))([= ])(?<value>([0-9]+(\.[0-9]+)?)|([a-zA-Z0-9-_\/.]+|'[a-zA-Z0-9-_/. ]*'))`, 'gm') :
            new RegExp(`(?<flag>-{2}(?<long>${flag.long}))([= ])(?<value>([0-9]+(\.[0-9]+)?)|([a-zA-Z0-9-_\/.]+|'[a-zA-Z0-9-_/. ]*'))`, 'gm');

        const matches = preg_match_all(regex, matched) as {flag: string, long?: string, short?: string, value: string}[]|null;
        flag.value = matches?.reduce<(string|number)[]>((r, el) => {
            if (preg_match(/^[0-9]+.?[0-9]*$/g, el.value) !== null && !el.value.startsWith('0')) {
                return [...r, (el.value.includes('.') ? parseFloat(el.value) : parseInt(el.value))]
            }
            return [...r, el.value];
        }, []);

        return flag;
    });

const getSelectedCommandResult = (cmd: string) => {
    let regex: RegExp|null = null;
    let isAdmin = false;
    let matchExecute: TerminalCommandExecute|null = null;
    let flags: TerminalCommandFlag[] = [];

    for (const c of [...commands, ...commandsPlugins.value]) {
        const isAdminCommand = c.adminCommand && preg_match(c.adminCommand, cmd) !== null;
        const isNotAdminCommand = preg_match(c.command, cmd) !== null;

        if (isAdminCommand) {
            regex = c.adminCommand!;
            isAdmin = true;
            matchExecute = c.execute;
            flags = c.flags ?? [];
            break;
        }
        else if (isNotAdminCommand) {
            regex = c.command;
            isAdmin = false;
            matchExecute = c.execute;
            flags = c.flags ?? [];
            break;
        }
    }

    if (regex && matchExecute) {
        const groups = preg_match(regex, cmd);
        let _groups = typeof groups === 'object' ? groups : {};

        if (_groups && Object.keys(_groups).includes('flags')) {
            flags = getFlags(flags, (_groups as Record<string, string|null>)!.flags ?? '');
        }

        return {
            regex, isAdmin,
            execute: matchExecute,
            flags, groups: _groups
        }
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
                    isAdmin,
                    groups,
                    flags,
                    execute
                } = selectedCommand;
                const setters = {
                    result: setResult,
                    command: setCommand,
                    terminalHistory: setTerminalHistory,
                    location: setLocation
                };
                const oldLineHeader = lineHeader.value;
                const r = migrateToArray(execute((groups ?? {}), isAdmin, flags.reduce<{[K: string]: string|boolean|number|any[]}>((r, c) => ({
                    ...r,
                    [c.long]: c.value!
                }), {}), location, setters));

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