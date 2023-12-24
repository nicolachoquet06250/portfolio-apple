<template>
  <div class="cv-header">
    <img :src="logo" alt="logo" />

    <span>Mon CV</span>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/icons/facebook-profile-pic.png'
</script>

<style scoped lang="scss">
.cv-header {
  padding: 10px;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    height: 100%;
    width: auto;
  }

  span {
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>