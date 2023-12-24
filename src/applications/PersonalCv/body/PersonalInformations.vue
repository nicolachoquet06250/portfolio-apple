<template>
  <div>
    <img :src="personalInformations.profilePicture" alt="photo de profile">

    <div>
      <h2>{{personalInformations.firstname}}</h2>
      <h3>{{personalInformations.lastname}}</h3>
      <p>
        <i class="fa-brands fa-github"></i> <a :href="personalInformations.github" target="_blank">Mon Github</a>
      </p>
      <p>{{personalInformations.email}}</p>
      <p>{{personalInformations.age}} ans</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {InformationsType, usePersonalInformations} from '@/hooks/personal-informations.ts';

const personalInformations = usePersonalInformations(InformationsType.ALL)
</script>

<style scoped lang="scss">
  div {
    display: flex;
    flex-direction: row;

    &:first-of-type {
      > img {
        width: 200px;
        height: 200px;
      }

      > div {
        display: flex;
        flex-direction: column;

        > h2 {
          margin-bottom: 5px;
        }
        > h3 {
          margin-top: 5px;
        }
        > p {
          margin: 0
        }
      }
    }
  }
</style>