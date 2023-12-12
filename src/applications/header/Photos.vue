<template>
    <div class="photos-header">
        <div class="left-side">
            <div class="range-container" @mouseover="setPointerCursor" @mouseout="setDefaultCursor">
                <span> - </span> 

                <input type="range" class="custom" value="50" /> 

                <span> + </span>
            </div>
        </div>

        <div class="right-side">
            <div class="search-bar" @mouseover="setPointerCursor" @mouseout="setDefaultCursor">
                <label for="search" @click="searchFocused = true">
                    <i class="fas fa-search"></i>
                </label>

                <input type="search" id="search" placeholder="Search Field" ref="search" />

                <label for="search" @click="clear()"></label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CURSOR, useCursor } from '@/hooks/cursor';

const { setCursor } = useCursor();

const searchFocused = ref(false);
const search = ref<HTMLInputElement|null>(null);

watch(searchFocused, () => {
    if (search.value) {
        if (searchFocused.value) {
            search.value.focus();
        }
    }
});

watch(search, () => {
    search.value!.addEventListener('focusout', () => {
        searchFocused.value = false;
    })
});

const clear = () => {
    search.value!.value = '';
    search.value!.focus();
}

const setPointerCursor = () => setCursor(CURSOR.POINTER);
const setDefaultCursor = () => setCursor(CURSOR.DEFAULT);

</script>

<style lang="scss">
label {
    &, & * {
        cursor: url(/cursors/_normal.png), default !important;
    }
}

input {
    &:hover, &:hover *, 
    &[type=range].custom::-webkit-slider-runnable-track, 
    &[type=range].custom::-webkit-slider-thumb {
        cursor: url(/cursors/_pointer.png), default !important;
    }
}

.show-big-cursor {
    label {
        &, & * {
            cursor: url(/cursors/normal-50x50.png), default !important;
        }
    }

    input {
        &:hover, &:hover *, 
        &[type=range].custom::-webkit-slider-runnable-track, 
        &[type=range].custom::-webkit-slider-thumb {
            cursor: url(/cursors/pointer-50x50.png), default !important;
        }
    }
}
</style>

<style lang="scss" scoped>
.photos-header {
    display: flex;
    flex-direction: row;
    flex: 1;

    .range-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        > span {
            font-size: 20px;
            margin-left: 5px;
            margin-right: 5px;
            color: #A1A1A1;
            display: flex;
            justify-content: center;
            align-items: center;

            &:first-child {
                padding-bottom: 5px;
            }
        }

        input[type=range].custom {
            width: 70px;
            -webkit-appearance: none;
            padding: 0;
            font: inherit;
            outline: none;
            opacity: .8;
            box-sizing: border-box;
            transition: opacity .2s;
            cursor: pointer;
            height: auto;
            background: transparent;
            --thumb-radius: 50%;

            &::-webkit-slider-runnable-track {
                width: 100%;
                position: relative;
                height: 4px;
                cursor: pointer;
                box-shadow: none;
                background: #A1A1A1;
                border-radius: 14px;
                border: none;
            }

            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 15px;
                height: 15px;
                box-sizing: border-box;
                padding: 0.25em;
                border: 1px solid #888;
                border-radius: 50%;
                box-shadow: 0 0 0.5em #fff inset;
                background: white;
                margin-top: -6px;
            }
        }
    }

    .right-side {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .search-bar {
        display: flex;
        flex-direction: row;
        width: auto;
        position: relative;
        height: 25px;
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid #F5F5F5;
        margin-right: 10px;

        label:first-child {
            position: absolute;
            top: 0;
            left: 0;
            right: 20px;
            bottom: 0;
            padding-left: 10px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            border-radius: 10px;

            i {
                color: #A0A0A0;
            }
        }

        label:last-child {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 20px;
        }

        input[type=search] {
            outline: none;
            border: none;
            width: 100%;
            padding-left: 35px;

            &::placeholder {
                color: #BDBDBD;
            }
        }
    }
}
</style>