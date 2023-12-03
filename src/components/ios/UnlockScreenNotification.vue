<template>
    <article>
        <section :class="{'with-icon': !!icon}">
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
        </section>

        <section class="actions" v-if="slots.actions">
          <slot name="actions" />
        </section>
    </article>
</template>

<script setup>
import {computed, useSlots} from 'vue';

const props = defineProps({
    icon: {
        type: String,
        default: ''
    },
    date: {
        type: [Date, String],
        default: () => new Date()
    }
});

const slots = useSlots();

const formattedDate = computed(() =>
    typeof props.date === 'string'
        ? props.date
        : `${props.date.getHours() < 10 ? '0' : ''}${props.date.getHours()}:${props.date.getMinutes() < 10 ? '0' : ''}${props.date.getMinutes()}`);
</script>

<style lang="scss" scoped>
    article {
        width: 100%;
        margin: 15px;
        border: 1px solid white;
        border-radius: 25px;
        background-color: rgba(255, 255, 255, .8);

        display: flex;
        flex-direction: column;

        section {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          padding-left: 15px;
          padding-right: 15px;
          height: 100%;

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

          &.actions {
            justify-content: center;
            align-items: center;
            padding: 0;
          }

          * {
            color: black;
          }
        }
    }

    :global(article section.actions button) {
      flex: 1;
      font-size: 20px;
      padding: 5px;
      border: none;
      background: rgba(255, 255, 255, .5);
    }

    :global(article section.actions > button:first-of-type) {
      border-bottom-left-radius: 25px;
    }

    :global(article section.actions > button:last-of-type) {
      border-bottom-right-radius: 25px;
    }
</style>