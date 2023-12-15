import {onKeyStroke} from "@vueuse/core";
import {computed, ref, watch} from "vue";
import type {ComputedRef, Ref} from 'vue';
import {useCommandHistory, useCommands} from "@/hooks/terminal/commands";
import {useTerminalLocation} from '@/hooks/terminal/location';
import type {Setter} from '@/commands/types';

type UseTerminal = (active: Ref<boolean> | ComputedRef<boolean>) => [
    command: Ref<string>,
    completion: ComputedRef<string|string[]>,
    result: ComputedRef<string[]>,
    terminalHistory: ComputedRef<string[]>,
    location: [location: ComputedRef<string>, setComputed: Setter<string>]
];

type ExcludedKey = string|RegExp;

const excludedKeys: ExcludedKey[] = [
    'Shift', 'Control',
    'Backspace', 'Enter',
    'Tab', 'Delete',
    'ArrowUp', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    /^F[1-9][0-2]?$/
];

export const useTerminal: UseTerminal = (active) => {
    const terminalHistory = ref<string[]>([]);
    const command = ref('');
    const tmpCommand = ref<string|null>(null);
    const [
        history, historyIndex,
        addCommandToHistory, setHistoryIndex,
        currentHistoryCommand
    ] = useCommandHistory();
    const location = useTerminalLocation();
    const {
        autocomplete,
        execute,
        proposedCommand,
        result
    } = useCommands(command, terminalHistory, location);

    onKeyStroke('Backspace', e => {
        if (active.value) {
            e.preventDefault();
            command.value.length !== 0 &&
            (command.value = command.value.substring(0, command.value.length - 1));
        }
    });

    onKeyStroke('Tab', e => {
        if (active.value) {
            e.preventDefault();
            autocomplete(command.value);
        }
    });

    onKeyStroke('Enter', e => {
        if (active.value) {
            e.preventDefault();
            execute(addCommandToHistory);
        }
    });

    onKeyStroke('ArrowUp', e => {
        e.preventDefault();

        if (historyIndex.value === -1) {
            tmpCommand.value = command.value;
        }

        if (historyIndex.value < history.value.length - 1) {
            setHistoryIndex(i => ++i);
        }
    });

    onKeyStroke('ArrowDown', e => {
        e.preventDefault();

        if (historyIndex.value > -1) {
            setHistoryIndex(i => --i);
        }
    });

    onKeyStroke(true, e => {
        if (active.value) {
            e.preventDefault();

            const isIncluded = excludedKeys
                .map(key =>
                    typeof key === 'string' ?
                        key === e.key : key.exec(e.key) !== null)
                .filter(i => i).length > 0;
            if (!isIncluded) {
                tmpCommand.value = null;
                setHistoryIndex(-1);
                command.value += e.key;
            }
        }
    });

    watch(currentHistoryCommand, currentHistoryCommand => {
        if (currentHistoryCommand !== null) {
            command.value = currentHistoryCommand;
        }
        else if (tmpCommand.value !== null) {
            command.value = tmpCommand.value;
            tmpCommand.value = null;
        }
    });

    watch(proposedCommand, (proposed) => console.log(proposed))

    return [
        command,
        computed(() => typeof proposedCommand.value === 'string'
            ? proposedCommand.value.substring(command.value.length) : proposedCommand.value),
        result,
        computed(() => terminalHistory.value),
        location
    ];
};
