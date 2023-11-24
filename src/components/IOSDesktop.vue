<template>
  <div class="system-error-page">

    <div class="middle-block-container">
      <div class="icon-container">
        <i class="fab fa-apple" style="color: white;"></i>
      </div>

      <div class="message-container">
        IOS is not implemented for the moment.
      </div>
    </div>
  </div>

  <slot></slot>
</template>

<style lang="scss" scoped>
  div.system-error-page {
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 100px;

    .middle-block-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transform: translateY(-10%);

      .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .message-container {
        color: whitesmoke;
        font-size: 20px;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
</style>
