import {ref} from 'vue';
import {TerminalCommand} from '@/commands/types';

export const commands = ref<TerminalCommand[]>([]);

export const registerPlugin = (command: TerminalCommand) => {
    commands.value = [...commands.value, command];
}

export const registerPlugins = (...commandList: TerminalCommand[]) => {
    commands.value = [...commands.value, ...commandList];
}
