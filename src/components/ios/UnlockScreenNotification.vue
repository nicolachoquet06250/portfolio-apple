<template>
    <article :class="icon ? 'with-icon' : ''">
        <div v-if="icon">
            <img :src="icon" alt="icon notification" />
        </div>

        <div>
            <header>
                <h1>
                    <slot name="title" />
                </h1>

                <span class="hour">
                    {{ formattedDate }}
                </span>
            </header>

            <main>
                <p>
                    <slot />
                </p>
            </main>
        </div>
    </article>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
    icon: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: () => new Date()
    }
});

const formattedDate = computed(() => `${props.date.getHours() < 10 ? '0' : ''}${props.date.getHours()}:${props.date.getMinutes() < 10 ? '0' : ''}${props.date.getMinutes()}`);
</script>

<style lang="scss" scoped>
    article {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        margin: 15px;
        padding-left: 15px;
        padding-right: 15px;
        border: 1px solid white;
        border-radius: 25px;
        background-color: rgba(255, 255, 255, .8);

        &.with-icon {
            > div:first-of-type {
                flex: 1;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-right: 10px;

                img {
                    width: 50px;
                    height: auto;
                }
            }

            > div:last-of-type {
                width: 100%;
                display: flex;
                flex-direction: column;
                margin-top: 5px;
                margin-bottom: 5px;

                > header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    h1 {
                        margin-bottom: 5px;
                        margin-top: 10px;
                    }

                    .hour {
                        color: rgba(0, 0, 0, .5)
                    }
                }

                > main {
                    p {
                        margin: 0;
                    }
                    padding-bottom: 15px;
                }
            }
        }

        &:not(.with-icon) {
            > div {
                width: 100%;
                display: flex;
                flex-direction: column;
                margin-top: 5px;
                margin-bottom: 5px;

                > header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    h1 {
                        margin-bottom: 5px;
                        margin-top: 10px;
                    }

                    .hour {
                        color: rgba(0, 0, 0, .5)
                    }
                }

                > main {
                    p {
                        margin: 0;
                    }
                    padding-bottom: 15px;
                }
            }
        }

        * {
            color: black;
        }
    }
</style>