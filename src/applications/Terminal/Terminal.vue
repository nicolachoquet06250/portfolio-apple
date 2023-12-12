<template>
    <div class="terminal">
        <div ref="target">
            {{ lineHeader }}
            {{ command }}
            <span>{{autocompletion}}</span>
            <cursor :blink="appFocused" />
        </div>

        <div></div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import Cursor from "@/applications/Terminal/Cursor.vue";
import {APPLICATION, useCurrentApp} from "@/hooks/apps";
import {useTerminal} from "@/hooks/terminal/terminal";
import {useTerminalLineHeader} from "@/hooks/terminal/line-header";

const {currentApp} = useCurrentApp();
const target = ref(null);
const appFocused = computed(() => currentApp.value === APPLICATION.TERMINAL);
const [command, autocompletion] = useTerminal(appFocused);
const lineHeader = useTerminalLineHeader();
</script>

<style lang="scss" scoped>
h1 {
    margin-top: 0;
}

.terminal {
  height: 100%;
  cursor: text;
}
</style>