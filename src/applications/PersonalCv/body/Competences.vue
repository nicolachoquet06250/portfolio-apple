<template>
  <div style="margin-left: 15px">
    <h2>Langages maitrisés</h2>

    <table>
      <template v-for="language of personalInformations.programationLanguages" :key="language.label">
        <tr>
          <th style="display: flex; justify-content: flex-start">
            <i :class="language.icon"/>
            <strong style="margin-left: 5px">{{language.label}}</strong>
          </th>

          <td>
            <Stars :note="language.stars" />
          </td>
        </tr>

        <template v-if="language.runtimes">
          <tr>
            <th colspan="2">
              <h3 style="margin: 5px; text-align: left">Runtimes</h3>
            </th>
          </tr>

          <tr v-for="runtime of language.runtimes" :key="runtime.label">
            <td style="padding-left: 15px">
              <i :class="runtime.icon"/>
              <strong style="margin-left: 5px">{{runtime.label}}</strong>
            </td>

            <td>
              <Stars :note="runtime.stars" v-if="runtime.stars !== undefined" />
            </td>
          </tr>
        </template>

        <template v-if="language.libraries">
          <tr>
            <th colspan="2">
              <h3 style="margin: 5px; text-align: left">Bibliothèques</h3>
            </th>
          </tr>

          <tr v-for="library of language.libraries" :key="library.label">
            <td style="padding-left: 15px">
              <i :class="library.icon"/>
              <strong style="margin-left: 5px">{{library.label}}</strong>
            </td>

            <td>
              <Stars :note="library.stars" v-if="library.stars !== undefined" />
            </td>
          </tr>
        </template>

        <template v-if="language.frameworks">
          <tr>
            <th colspan="2">
              <h3 style="margin: 5px; text-align: left">Frameworks</h3>
            </th>
          </tr>

          <tr v-for="framework of language.frameworks" :key="framework.label">
            <td style="padding-left: 15px">
              <i :class="framework.icon"/>
              <strong style="margin-left: 5px">{{framework.label}}</strong>
            </td>

            <td>
              <Stars :note="framework.stars" v-if="framework.stars !== undefined" />
            </td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script setup lang="ts">
import {InformationsType, usePersonalInformations} from '@/hooks/personal-informations.ts';
import Stars from '@/applications/PersonalCv/utils/Stars.vue';

const personalInformations = usePersonalInformations(InformationsType.ALL)
</script>

<style scoped lang="scss">

</style>