<template>
    <div :class="{
        screen: true,
        close: Math.abs(distanceY_) < swipeHeight! / 2 && close,
        open,
        mobile: deviceType === IS_MOBILE || deviceType === IS_TABLET
    }" ref="view">
        <h1>hello</h1>

        <SwiperComponent @swipe="onSwipe" @swipe-end="onSwipeEnd">
            <footer> Swipe up to open </footer>
        </SwiperComponent>
    </div>
</template>

<script setup lang="ts">
import {useIosOpenInstallerSwiper} from "@/hooks/ios-swiper";
import {computed, ComputedRef, Ref, ref} from "vue";
import {IS_MOBILE, IS_TABLET, useDeviceType} from "@/hooks/device-type";

const emit = defineEmits(['open-install']);

const SwiperComponent = useIosOpenInstallerSwiper();
const deviceType = useDeviceType();

const view = ref<HTMLElement|null>(null);
const swipeHeight = computed(() => view.value?.offsetHeight);
const translateY = ref('0');
const distanceY_ = ref(0);
const close = ref(false)
const open = ref(false)
function onSwipe(distanceY: Ref<number>|ComputedRef<number>) {
  distanceY_.value = distanceY.value;
  if (swipeHeight.value) {
    if (distanceY.value > 0) {
      const distance = -1 * Math.abs(distanceY.value)
      translateY.value = `${distance}px`;
    }
  }
}

function onSwipeEnd({direction, distanceY}: {direction: string, distanceY: Ref<number>|ComputedRef<number>}) {
  if (direction === 'up') {
    if (Math.abs(distanceY.value) < swipeHeight.value! / 2) {
      translateY.value = '0';
      close.value = true;

      setTimeout(() => {
        close.value = false;
      }, 2000);
    } else {
      translateY.value = `-${swipeHeight.value}px`;
      open.value = true;

      setTimeout(() => {
        open.value = false;
      }, 2000);
      emit('open-install');
    }
  }
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: "GrapeNutsRegular";
  src: url(/fonts/GrapeNuts-Regular.ttf);
}

.screen {
    * {
      user-select: none;
    }

    h1 {
      font-family: GrapeNutsRegular, Chilanka, sans-serif;
      font-weight: normal;
      font-style: normal;
      font-size: 7rem;
    }

    footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 20px;

        &:after {
          content: '';
          position: absolute;
          bottom: 15px;
          width: 150px;
          height: 5px;
          border-radius: 100px;
          background-color: white;
        }
    }

    position: relative;
    z-index: 9999;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    color: white;

    /*
     * Created with https://www.css-gradient.com
     * Gradient link: https://www.css-gradient.com/?c1=041107&c2=6918df&gt=r&gd=dcc
     */
    background: #041107;
    background: radial-gradient(at center, #041107, #6918DF);

    &.close, &.open {
        transition: transform .5s ease-in-out;
    }
    transform: translateY(v-bind(translateY));
}

@media (display-mode: browser) {
  .screen.mobile {
    height: calc(100% - 50px);
  }
}
</style>