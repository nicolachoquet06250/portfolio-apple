<template>
    <div class="ios-login-view">
        <header>
            <span>
                {{ formattedTime }}
            </span>
            
            <IOSNotch />

            <span></span>
        </header>

        <body>
            <h2>
                {{ formattedDate }}
            </h2>
            <h1>
                {{ formattedTime }}
            </h1>
        </body>

        <footer>
            <div ref="container" class="swipe-container">
                <div
                    ref="swipe"
                    class="swipe"
                    :style="{ left, opacity }"
                >
                    <p>
                        <img :src="rightArrow" alt="right arrow" />
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import IOSNotch from '@/components/ios/IOSNotch.vue';
import rightArrow from '@/assets/circle-right-regular.svg';
import { usePointerSwipe } from '@vueuse/core';
import { ref, onMounted, computed } from 'vue';

const emit = defineEmits(['unlock-screen'])

const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
];

const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];

const swipe = ref(null)
const container = ref(null)
const containerWidth = computed(() => container.value?.offsetWidth)

const left = ref('0')
const opacity = ref(1)

const { distanceX, isSwiping, posStart, posEnd, distanceY } = usePointerSwipe(swipe, {
  onSwipe(e) {
    if (containerWidth.value) {
      if (distanceX.value < 0) {
        const distance = Math.abs(distanceX.value)
        left.value = `${distance}px`
        opacity.value = 1.25 - distance / containerWidth.value
      }
      else {
        left.value = '0'
        opacity.value = 1
      }
    }
  },
  onSwipeEnd(e, direction) {
    if (distanceX.value < 0 && containerWidth.value && (Math.abs(distanceX.value) / containerWidth.value) >= 0.5) {
      left.value = '100%'
      opacity.value = 0
      emit('unlock-screen')
    }
    else {
      left.value = '0'
      opacity.value = 1
    }
  }
});

const t = ref(new Date());
const formattedTime = computed(() => `${t.value.getHours() < 10 ? '0' : ''}${t.value.getHours()}:${t.value.getMinutes() < 10 ? '0' : ''}${t.value.getMinutes()}`)
const formattedDate = computed(() => `${days[t.value.getDay()]} ${t.value.getDate()} ${months[t.value.getMonth()]}`)

onMounted(() => {
    setInterval(() => {
        t.value = new Date();
    }, 1000);
});

</script>

<style>
    #app {
        cursor: unset!important;;
    }
</style>

<style scoped lang="scss">
    .ios-login-view {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
        background-image: url(/img/wallpapers/ios-wallpaper.png);

        *, img {
            user-select: none;
        }

        header {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-top: 15px;
            font-weight: bold;

            > * {
                flex: 1;
            }

            > span {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;

            height: calc(100vh - 150px);
            
            h1 {
                font-size: 7rem;
                color: rgba(255, 255, 255, .8);
                margin: 0
            }

            h2 {
                color: rgba(255, 255, 255, .8);
            }
        }

        footer {
            position: relative;

            .swipe-container {
                height: 50px; 
                margin-left: 20px; 
                margin-right: 20px; 
                position: relative; 
                overflow: hidden;
                border-radius: 100px;

                .swipe {
                    position: absolute; 
                    width: 100%; 
                    top: 0; 
                    left: 0; 
                    background-color: rgba(255, 255, 255, .5);
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    border-radius: 100px;
                    padding-left: 5px;
                    left: v-bind(left);
                    opacity: v-bind(opacity);
                    cursor: pointer;

                    p {
                        padding: 0;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        margin: 0;
                        height: 50px;
                    }

                    img {
                        height: 100%;
                        width: auto;
                    }
                }
            }
        }
    }
</style>