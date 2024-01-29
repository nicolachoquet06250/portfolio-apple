<template>
    <section>
        <nav class="personal-informations">
            <div>
                <p>
                    <i class="fa-brands fa-github"></i> <a :href="personalInformations.github" target="_blank">Mon Github</a>
                </p>
                <p>{{personalInformations.email}}</p>
                <p>{{personalInformations.age}} ans</p>

                <a v-for="(site, i) of personalInformations.sites" :key="site.label + '-' + i"
                   :href="site.url"
                >
                  {{site.url}} <span style="color: gray">({{site.label}})</span>
                </a>
            </div>

            <div>
                <Competences />
            </div>
        </nav>

        <main>
            <div class="personal-informations">
                <img :src="personalInformations.profilePicture" alt="photo de profile">

                <div>
                    <h1>{{personalInformations.firstname}} {{personalInformations.lastname}}</h1>
                    <h2>{{personalInformations.postTitle}} chez {{personalInformations.society}}</h2>
                    <h3>{{personalInformations.location.city}}, {{personalInformations.location.region}}, {{personalInformations.location.country}}</h3>
                </div>

                <div>
                    <h1>Résumé</h1>

                    <template v-if="personalInformations.summary instanceof Array">
                        <p v-for="(line, i) of personalInformations.summary" :key="line + '-' + i">
                            {{line}} <span v-html="'<br>'" />
                        </p>
                    </template>
                    <template v-else>
                        {{personalInformations.summary}}
                    </template>
                </div>
            </div>
        </main>
    </section>
</template>

<script setup lang="ts">
// import {useCv} from '@/hooks/my-cv';
import {useNotifications} from '@/hooks/notifications';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {InformationsType, usePersonalInformations} from '@/hooks/personal-informations';
import Competences from '@/applications/PersonalCv/body/Competences.vue';

const personalInformations = usePersonalInformations(InformationsType.ALL);
const {profilePicture} = personalInformations;

// const {component} = useCv();
const { createNotification } = useNotifications();

const notificationOpened = ref(true);

onMounted(() => {
  createNotification({
    title: 'Mon CV',
    image: profilePicture,
    content: 'Cette application est encore en cours de développement.',
    opened: notificationOpened,
    autoClose: 3000,
    buttons: []
  })
})

onBeforeUnmount(() => {
  notificationOpened.value = false;
})
</script>

<style scoped lang="scss">
section {
    display: flex;
    flex-direction: row;

    nav {
        flex: 1;
        max-width: 200px;
    }

    main {
        flex: auto;

        .personal-informations {
            > img {
                width: 200px;
                height: 200px;

                border-radius: 200px;
                align-self: center;
            }

            > div {
                display: flex;
                flex-direction: column;

                > h1 {
                    font-size: 30px;
                    font-weight: lighter;
                    margin-bottom: 5px;
                }

                > h2 {
                    margin-bottom: 5px;
                    margin-top: 5px;
                    font-weight: normal;
                    font-size: 20px;
                }
                > h3 {
                    margin-top: 5px;
                    font-weight: normal;
                    font-size: 20px;
                    color: gray;
                }
                > p {
                   margin: 0
                }
            }
        }
    }
}

.personal-informations {
    display: flex;
    flex-direction: column;
}
</style>