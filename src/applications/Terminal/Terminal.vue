<template>
    <div :class="{
        terminal: true,
        isDarkMode
    }">
        <div v-for="(line, i) of terminalHistory" :key="i"
             v-html="line"
        />

      <div ref="target">
            {{ lineHeader }} {{ command }}

<!--            <span>{{ autocompletion }}</span>-->

            <cursor :blink="appFocused" />
        </div>

        <div ref="end" />
    </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import Cursor from "@/applications/Terminal/Cursor.vue";
import {APPLICATION, useCurrentApp} from "@/hooks/apps";
import {useTerminal} from "@/hooks/terminal/terminal";
import {useTerminalLineHeader} from "@/hooks/terminal/line-header";
import {useDark} from '@/hooks/theme';

const { isDark: isDarkMode } = useDark();
const {currentApp} = useCurrentApp();
const target = ref(null);
const appFocused = computed(() => currentApp.value === APPLICATION.TERMINAL);
const [command,,, terminalHistory] = useTerminal(appFocused);
const lineHeader = useTerminalLineHeader();

const end = ref<HTMLElement|null>(null);

watch(terminalHistory, () => {
  setTimeout(() => {
    end.value?.scrollIntoView({
      block: 'end',
      behavior: 'smooth'
    })
  }, 1);
})
</script>

<style lang="scss" scoped>
h1 {
    margin-top: 0;
}

.terminal {
  height: 100%;
  cursor: text;
  overflow-y: auto;
}
</style>