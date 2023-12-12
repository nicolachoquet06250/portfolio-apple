<template>
    <component :is="swiperComponent" 
                @swipe="onSwipe" 
                @swipe-end="onSwipeEnd">
        <div class="ios-login-view" ref="view">
          <top-bar :top-bar="topBar" />

            <main>
                <section>
                    <h2> {{ formattedDate }} </h2>

                    <h1> {{ formattedTime }} </h1>
                </section>
                
                <UnlockScreenNotificationList>
                    <RefreshPwaBanner />

                    <InstallationBanner
                        v-if="showInstallationBanner"
                        @close="showInstallationBanner = false"
                    />

                    <Notification 
                        v-for="{id, title, description, icon, date} in notifications" :key="id" 
                        :icon="icon" :date="date"
                    >
                        <template #title>
                            {{ title }}
                        </template>

                        {{ description }}
                    </Notification>
                </UnlockScreenNotificationList>
            </main>

            <footer>
                <button>
                    <svg
                        viewBox="0 0 10 23" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg">
                        <path width="32" height="32"
                            d="M3.85876 22.3989H6.20251C6.78845 22.3989 7.22953 22.2492 7.52575 21.9497C7.82198 21.6502 7.97009 21.1945 7.97009 20.5825V10.2114C7.97009 9.6971 8.02543 9.25114 8.13611 8.87353C8.24679 8.49593 8.39652 8.1639 8.58532 7.87744L9.22009 6.93994C9.44145 6.59489 9.62211 6.24983 9.76208 5.90478C9.90206 5.55973 9.97204 5.17888 9.97204 4.76221V3.96142H0.0892334V4.76221C0.0892334 5.17888 0.157593 5.55973 0.294311 5.90478C0.43103 6.24983 0.613322 6.59489 0.841186 6.93994L1.46618 7.87744C1.65499 8.1639 1.80473 8.49593 1.9154 8.87353C2.02608 9.25114 2.08142 9.6971 2.08142 10.2114V20.5825C2.08142 21.1945 2.23116 21.6502 2.53064 21.9497C2.83012 22.2492 3.27282 22.3989 3.85876 22.3989ZM5.03064 14.8892C4.6335 14.8892 4.31449 14.7574 4.07361 14.4937C3.83273 14.23 3.71228 13.8931 3.71228 13.4829V10.8071C3.71228 10.397 3.83273 10.0649 4.07361 9.81103C4.31449 9.55713 4.6335 9.43343 5.03064 9.43994C5.42778 9.44646 5.74679 9.57504 5.98767 9.82568C6.22856 10.0763 6.349 10.4035 6.349 10.8071V13.4829C6.349 13.8931 6.22856 14.23 5.98767 14.4937C5.74679 14.7574 5.42778 14.8892 5.03064 14.8892ZM5.03064 14.1958C5.24548 14.1958 5.43266 14.1177 5.59216 13.9614C5.75167 13.8052 5.83142 13.6164 5.83142 13.395C5.83142 13.1802 5.75167 12.9914 5.59216 12.8286C5.43266 12.6659 5.24548 12.5845 5.03064 12.5845C4.8158 12.5845 4.62699 12.6659 4.46423 12.8286C4.30147 12.9914 4.22009 13.1802 4.22009 13.395C4.22009 13.6164 4.30147 13.8052 4.46423 13.9614C4.62699 14.1177 4.8158 14.1958 5.03064 14.1958ZM0.0892334 2.81885H9.97204V2.3501C9.97204 1.73161 9.8223 1.27425 9.52282 0.978027C9.22335 0.681803 8.78064 0.533691 8.1947 0.533691H1.86657C1.28064 0.533691 0.837932 0.681803 0.538452 0.978027C0.238973 1.27425 0.0892334 1.73161 0.0892334 2.3501V2.81885Z" 
                            fill="white" 
                            fill-opacity="0.85"
                        />
                    </svg> 
                </button>

                <button>
                    <svg width="32" height="32"
                        viewBox="0 0 25 20" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.7959 19.1567H21.6475C22.6631 19.1567 23.4281 18.9044 23.9424 18.3999C24.4567 17.8954 24.7139 17.1385 24.7139 16.1294V5.90478C24.7139 4.90218 24.4567 4.1486 23.9424 3.64404C23.4281 3.13949 22.6631 2.88721 21.6475 2.88721H18.8545C18.5941 2.88721 18.3858 2.86768 18.2295 2.82861C18.0732 2.78955 17.9349 2.72282 17.8145 2.62842C17.694 2.53401 17.5589 2.40543 17.4092 2.24267L16.6279 1.36377C16.387 1.09684 16.1201 0.891765 15.8272 0.748535C15.5342 0.605306 15.137 0.533691 14.6357 0.533691H10.7393C10.238 0.533691 9.84245 0.605306 9.55273 0.748535C9.26302 0.891765 8.99447 1.09684 8.74707 1.36377L7.96582 2.24267C7.75098 2.48356 7.55241 2.6512 7.37011 2.7456C7.18783 2.84001 6.90463 2.88721 6.52051 2.88721H3.7959C2.77376 2.88721 2.00716 3.13949 1.49609 3.64404C0.985026 4.1486 0.729492 4.90218 0.729492 5.90478V16.1294C0.729492 17.1385 0.985026 17.8954 1.49609 18.3999C2.00716 18.9044 2.77376 19.1567 3.7959 19.1567ZM12.7217 16.2759C11.9795 16.2759 11.2861 16.1392 10.6416 15.8657C9.99707 15.5923 9.43229 15.2115 8.94726 14.7232C8.46223 14.2349 8.08138 13.6684 7.80469 13.0239C7.528 12.3794 7.38965 11.6828 7.38965 10.9341C7.38965 10.1919 7.528 9.49853 7.80469 8.854C8.08138 8.20947 8.46223 7.64307 8.94726 7.15478C9.43229 6.6665 9.99707 6.28564 10.6416 6.01221C11.2861 5.73877 11.9795 5.60205 12.7217 5.60205C13.7048 5.60205 14.5999 5.83968 15.4072 6.31494C16.2145 6.7902 16.8558 7.43148 17.3311 8.23877C17.8064 9.04606 18.044 9.9445 18.044 10.9341C18.044 11.6828 17.9073 12.3794 17.6338 13.0239C17.3603 13.6684 16.9795 14.2349 16.4912 14.7232C16.0029 15.2115 15.4365 15.5923 14.792 15.8657C14.1475 16.1392 13.4574 16.2759 12.7217 16.2759ZM12.7217 14.7915C13.4313 14.7915 14.0775 14.619 14.6602 14.2739C15.2429 13.9289 15.7067 13.465 16.0518 12.8823C16.3968 12.2996 16.5693 11.6502 16.5693 10.9341C16.5693 10.2245 16.3968 9.57829 16.0518 8.9956C15.7067 8.41292 15.2429 7.94743 14.6602 7.59912C14.0775 7.25081 13.4313 7.07666 12.7217 7.07666C12.012 7.07666 11.3659 7.25081 10.7832 7.59912C10.2005 7.94743 9.73503 8.41292 9.38672 8.9956C9.03842 9.57829 8.86426 10.2245 8.86426 10.9341C8.86426 11.6502 9.03842 12.2996 9.38672 12.8823C9.73503 13.465 10.2005 13.9289 10.7832 14.2739C11.3659 14.619 12.012 14.7915 12.7217 14.7915ZM18.6983 7.34033C18.6983 7.0083 18.8236 6.71696 19.0742 6.46631C19.3249 6.21566 19.6227 6.09033 19.9678 6.09033C20.2998 6.09033 20.5911 6.21566 20.8418 6.46631C21.0925 6.71696 21.2178 7.0083 21.2178 7.34033C21.2178 7.69189 21.0925 7.98811 20.8418 8.229C20.5911 8.46989 20.2998 8.59033 19.9678 8.59033C19.6227 8.59684 19.3249 8.47803 19.0742 8.23389C18.8236 7.98974 18.6983 7.69189 18.6983 7.34033Z" 
                            fill="white" 
                            fill-opacity="0.85"
                        />
                    </svg> 
                </button>
            </footer>
        </div>
    </component>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed, defineProps, Ref, ComputedRef} from 'vue';
import { useIosSwiper } from '@/hooks/ios-swiper';
import Notification from '@/components/ios/UnlockScreenNotification.vue';
import UnlockScreenNotificationList from './UnlockScreenNotificationList.vue';
import iconMusicIos from '@/assets/icons/icon-ios.png';
import InstallationBanner from "@/components/ios/InstallationBanner.vue";
import RefreshPwaBanner from "@/components/ios/RefreshPwaBanner.vue";
import TopBar from "@/components/ios/TopBar.vue";

const swiperComponent = useIosSwiper();

const emit = defineEmits(['unlock-screen']);

type TopBarProps = {
  network: {
    wifi: {
      online: boolean,
    },
  },
  battery: {
    charging: boolean,
    chargingTime: number,
    dischargingTime: number,
    level: number,
  }
}

const props = defineProps<{
  backgroundImage: string,
  apps: any[],
  currentAppName: string,
  topBar: TopBarProps
}>();
const backgroundImage = computed(() => `url(${props.backgroundImage})`);

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

const showInstallationBanner = ref(true);

const notifications = ref([
    {
        id: 0,
        icon: iconMusicIos,
        title: 'Jam',
        description: 'Michael Jackson',
        date: new Date()
    }
]);

const view = ref<HTMLElement|null>(null);
const swipeHeight = computed(() => view.value?.offsetHeight);
const blur = ref(0);
const cssBlur = computed(() => `${blur.value}px`);

const isSwiped = computed(() => blur.value !== 0);
const buttonZIndex = computed(() => isSwiped.value ? 0 : 2);

const showNotifications = ref(false);

function onSwipe(distanceY: Ref<number>|ComputedRef<number>) {
    if (swipeHeight.value) {
        if (distanceY.value < 0) {
            const distance = -1 * Math.abs(distanceY.value)
            blur.value = Math.min(100 - ((swipeHeight.value + distance) / 10), 15)
        }
        else {
            blur.value = 0
        }
    }
}

function onSwipeEnd(direction: string) {
    if (direction === 'down') {
        showNotifications.value = true;
    } else if (direction === 'up') {
        if (showNotifications.value) {
            showNotifications.value = false;
        } else {
            emit('unlock-screen');
        }
    }
}

const t = ref(new Date());
const dateInterval = ref<NodeJS.Timeout|number|null>(null);
const formattedTime = computed(() => `${t.value.getHours() < 10 ? '0' : ''}${t.value.getHours()}:${t.value.getMinutes() < 10 ? '0' : ''}${t.value.getMinutes()}`)
const formattedDate = computed(() => `${days[t.value.getDay()]} ${t.value.getDate()} ${months[t.value.getMonth()]}`)

onMounted(() => {
    dateInterval.value = setInterval(() => {
        t.value = new Date();
    }, 1000);
});

onUnmounted(() => {
    if (dateInterval.value) {
        clearInterval(dateInterval.value);
    }
});
</script>

<style scoped lang="scss">
    .ios-login-view {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 0;
        left: 0;
        z-index: 9999;
        background-image: v-bind(backgroundImage);
        cursor: default !important;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            backdrop-filter: blur(v-bind(cssBlur));
        }

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

            .connectivity {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;

                ul {
                    margin-left: 10px;
                    margin-right: 10px;
                    padding-left: 0;
                    width: 100%;
                    list-style: none;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                }

                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 10px;
                    width: 80px;
                    height: 4px;
                    background-color: rgba(255, 255, 255, .3);
                    border-radius: 100px;
                }
            }
        }

        main {
            flex: 1;

            justify-content: space-between;

            &, section {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            section {
                width: calc(100% - 20px);

                &:first-of-type {
                    h1 {
                        font-size: 7rem;
                        color: rgba(255, 255, 255, .8);
                        margin: 0
                    }

                    h2 {
                        color: rgba(255, 255, 255, .8);
                    }
                }

                &:last-of-type {
                    padding-bottom: 50px;
                    position: relative;
                    z-index: v-bind(buttonZIndex);
                }
            }
            
            padding-top: 20px;
            height: calc(100vh - 150px);
        }

        footer {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 50px;
            z-index: v-bind(buttonZIndex);

            button {
                background: rgba(255, 255, 255, .4);
                width: 70px;
                height: 70px;
                border: 1px solid transparent;
                border-radius: 100px;
                padding: 18px;

                &, * {
                    cursor: pointer !important;
                }

                &:first-of-type {
                    margin-left: 50px;
                }

                &:last-of-type {
                    margin-right: 50px;
                }

                svg {
                    height: 32px;
                    width: 32px;
                }
            }
        }
    }
</style>