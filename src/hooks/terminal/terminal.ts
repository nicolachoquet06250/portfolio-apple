import {onKeyStroke} from "@vueuse/core";
import {computed, ref} from "vue";
import type {ComputedRef, Ref} from 'vue';
import {useCommands} from "@/hooks/terminal/commands";

export type UseTerminal = (active: Ref<boolean> | ComputedRef<boolean>) => [
    command: Ref<string>,
    completion: ComputedRef<string>
];

export const useTerminal: UseTerminal = (active) => {
    const command = ref('');
    const {autocomplete, execute, proposedCommand} = useCommands(command);

    const excludedKeys = ['Shift', 'Control', 'Backspace', 'Enter', 'Tab'];

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
            autocomplete();
        }
    });

    onKeyStroke('Enter', e => {
        if (active.value) {
            e.preventDefault();
            execute();
        }
    });

    onKeyStroke(true, e => {
        if (active.value) {
            console.log(e);
            e.preventDefault();
            !excludedKeys.includes(e.key) && (command.value += e.key);
        }
    });

    return [
        command,
        computed(() => proposedCommand.value.substring(command.value.length))
    ];
};