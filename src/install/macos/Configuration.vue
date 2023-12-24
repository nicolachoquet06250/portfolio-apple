<template>
    <div class="choose-style-step">
        <div class="blur"></div>

        <div class="window">
            <div class="window-body">
                <h1> <span class="main">Configuration du Portfolio</span><span v-for="i of nbDots" :key="i" class="dot">.</span> </h1>
                
                <img :src="iconConfig" alt="icon config" />
            </div>
            
            <div class="window-footer"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineEmits, ref, watch} from 'vue';
import { useDatabase } from '@/hooks/database/hooks';
import { useCountries } from '@/hooks/installation/langue';
import { useAccount } from '@/hooks/installation/account';
import { useTheme } from '@/hooks/installation/system-style';
import iconConfig from '@/assets/install-icons/icon-config-mac.png';

const emit = defineEmits(['nextStep']);

const { country } = useCountries();
const { fullName, accountName } = useAccount();
const { selectedTheme } = useTheme();
const [
  { addSettingss },
  { addAccount },
  { addTreeStructures }
] = [
    useDatabase('portfolio-apple', 'settings'),
    useDatabase('portfolio-apple', 'account'),
    useDatabase('portfolio-apple', 'treeStructure')
]

const nbFinished = ref(0);

const dbQueue = ref([
    () => {
      const ids = addSettingss(
          {
            field: 'country',
            value: country.value
          },
          {
            field: 'theme',
            value: selectedTheme.value
          }
      );

      watch(ids, (ids) => {
        if (ids) {
          console.log('step 1')

          nbFinished.value++;
        }
      });
    },
    () => {
      const accountId = addAccount({
        full_name: fullName.value,
        account_name: accountName.value
      });

      watch(accountId, (accountId) => {
        if (accountId) {
          console.log('step 2')

          nbFinished.value++;
        }
      });
    },
    () => {
        const parent = `/${accountName.value}`;
        const ids = addTreeStructures(
            {
              user_id: 1,
              name: accountName.value,
              extension: null,
              parent: '/',
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'Applications',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'AirDrop',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'Desktop',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'Images',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'Videos',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'Documents',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            },
            {
              user_id: 1,
              name: 'Downloads',
              extension: null,
              parent,
              content: null,
              type: 'directory',
              creation_date: new Date(),
              updated_date: new Date(),
              opened_date: new Date()
            }
        );

        watch(ids, (ids) => {
          if (ids.length) {
            console.log('step 3')

            nbFinished.value++;
          }
        });
    }
]);

dbQueue.value[0]();

const nbDots = ref(1);

setInterval(() => {
    if (nbDots.value === 3) {
        nbDots.value = 0;
    }
    nbDots.value++;
}, 500);

watch(nbFinished, () => {
    // gestion des différentes requêtes dans une queue 
    // pour ne pas que les connections se fassent en même temps.
    const tmp = [...dbQueue.value];
    tmp.shift();
    dbQueue.value = tmp;
    if (dbQueue.value[0]) dbQueue.value[0]();
    // FIN DE LA GESTION DE LA QUEUE

    if (nbFinished.value === 3) {
        setTimeout(() => {
            emit('nextStep', {
                event: null,
                details: {}
            });
        }, 2000);
    }
});
</script>

<style lang="scss" scoped>
.choose-style-step {
    cursor: default;
    background-image: url(/img/wallpapers/wallpaper-install-macos.jpg);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    .blur {
        position: absolute;
        top: 0;
        left:0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(1.5rem);
    }

    .window {
        box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);
        background-color: #F7F7F7;
        backdrop-filter: blur(1.5rem);
        position: absolute;
        width: 920px;
        height: 750px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        z-index: 1;
        left: calc(50% - (920px / 2));
        top: calc(50% - (750px / 2));

        &-body {
            display: flex;
            flex: 9;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            margin-top: 30px;
            padding-top: 70px;

            img {
                width: 500px;
            }

            h1 {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                width: 430px;

                span {
                    display: inline-block;

                    .dot {
                        width: 5px;
                    }

                    &.main {
                        width: max-content;
                    }
                }
            }
        }

        &-footer {
            background-color: #F2F2F2F2;
            display: flex;
            flex: .75;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            border-top: 2px solid #E9E9E9;
        }
    }
}
</style>