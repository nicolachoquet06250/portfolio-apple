<template>
  <nav>
    <ul>
      <li>
        <img :src="phoneAppIcon" alt="phone app icon">
      </li>
      <li>
        <img :src="messagesAppIcon" alt="messages app icon">
      </li>
      <li>
        <img :src="safariAppIcon" alt="safari app icon">
      </li>
      <li>
        <img :src="musicAppIcon" alt="music app icon">
      </li>
    </ul>
  </nav>
</template>

<script setup>
import phoneAppIcon from "@/assets/icons/ios/ios-phone-icon.png";
import messagesAppIcon from "@/assets/icons/ios/ios-messages-icon.png";
import safariAppIcon from "@/assets/icons/ios/ios-safari-icon.png";
import musicAppIcon from "@/assets/icons/ios/ios-music-icon.png";
</script>

<style scoped lang="scss">
  nav {
    background: rgba(255, 255, 255, .5);
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 40px;
    width: 100%;
    max-width: 500px;

    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      li {
        img {
          width: 60px;
          height: auto;
          border-radius: 20px;
        }
      }
    }
  }
</style>