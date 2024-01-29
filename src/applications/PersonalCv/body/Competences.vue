<template>
  <div style="margin-left: 15px">
    <h2>Langages maitrisés</h2>

    <table>
      <template v-for="language of personalInformations.programationLanguages" :key="language.label">
        <tr>
          <th colspan="2" style="display: flex; justify-content: flex-start">
            <i :class="language.icon"/>
            <strong style="margin-left: 5px">{{language.label}}</strong>
          </th>
        </tr>
        <tr>
          <td colspan="2">
            <ProgressBar :note="language.stars" />
          </td>
        </tr>

        <template v-if="language.runtimes">
          <tr>
            <th colspan="2">
              <h3 style="margin: 5px; text-align: left">Runtimes</h3>
            </th>
          </tr>

          <template v-for="runtime of language.runtimes" :key="runtime.label">
            <tr>
              <td colspan="2" style="padding-left: 15px">
                <i :class="runtime.icon"/>
                <strong style="margin-left: 5px">{{runtime.label}}</strong>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-left: 15px">
                <ProgressBar :note="runtime.stars" v-if="runtime.stars !== undefined" />
              </td>
            </tr>
          </template>
        </template>

        <template v-if="language.libraries">
          <tr>
            <th colspan="2">
              <h3 style="margin: 5px; text-align: left">Bibliothèques</h3>
            </th>
          </tr>

          <template v-for="library of language.libraries" :key="library.label">
            <tr>
              <td colspan="2" style="padding-left: 15px">
                <i :class="library.icon"/>
                <strong style="margin-left: 5px">{{library.label}}</strong>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-left: 15px">
                <ProgressBar :note="library.stars" v-if="library.stars !== undefined" />
              </td>
            </tr>
          </template>
        </template>

        <template v-if="language.frameworks">
          <tr>
            <th colspan="2">
              <h3 style="margin: 5px; text-align: left">Frameworks</h3>
            </th>
          </tr>

          <template v-for="framework of language.frameworks" :key="framework.label">
            <tr>
              <td colspan="2" style="padding-left: 15px">
                <i :class="framework.icon"/>
                <strong style="margin-left: 5px">{{framework.label}}</strong>
              </td>
            </tr>

            <tr>
              <td colspan="2" style="padding-left: 15px">
                <ProgressBar :note="framework.stars" v-if="framework.stars !== undefined" />
              </td>
            </tr>
          </template>
        </template>
      </template>
    </table>
  </div>
</template>

<script setup lang="ts">
import {InformationsType, usePersonalInformations} from '@/hooks/personal-informations.ts';
import ProgressBar from '@/applications/PersonalCv/utils/ProgressBar.vue';

const personalInformations = usePersonalInformations(InformationsType.ALL)
</script>

<style scoped lang="scss">

</style>