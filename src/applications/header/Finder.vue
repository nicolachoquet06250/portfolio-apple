<template>
<div class="left-side">
    <button>
        <i class="fas fa-chevron-left"></i>
    </button>

    <button>
        <i class="fas fa-chevron-right"></i>
    </button>

    <h1> {{ selectedTab }} </h1>
</div>

<div class="right-side">
    <div>
        <button>
            <i class="fas fa-border-all"></i>
            <i class="fas fa-angle-down"></i>
        </button>

        <button>
            <i class="fas fa-table"></i>
            <i class="fas fa-angle-down"></i>
        </button>

        <button>
            <i class="fas fa-ellipsis-h"></i>
            <i class="fas fa-angle-down"></i>
        </button>
    </div>

    <div>
        <button>
            <i class="fas fa-upload"></i>
        </button>
        
        <button>
            <i class="fas fa-tag"></i>
        </button>
        
        <button>
            <i class="fas fa-angle-double-right"></i>
        </button>
        
        <button>
            <i class="fas fa-search" style="font-size: 20px; margin-right: 5px; color: #C5C5C5;"></i>
        </button>
    </div>
</div>
</template>

<script setup>
import { useCurrentApp } from '@/hooks/apps';
import { useFinder } from '@/hooks/finder';

const { currentAppHeaderBar } = useCurrentApp();
const { selectedTab } = useFinder();
</script>

<style lang="scss">
.app-header-bar {
    -moz-user-select: none; /* Firefox */
    -webkit-user-select: none; /* Chrome, Safari, Opéra depuis la version 15 */
    -ms-user-select: none; /* Internet explorer depuis la version 10 et Edge */
    user-select: none; /* Propriété standard */

    .left-side {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;

        button {
            width: 40px;
            height: 40px;
            font-size: 20px;
            margin-right: 10px;
            color: #C5C5C5;
            background-color: transparent;
            border: none;

            i.fas {
                color: #C5C5C5;
            }
        }

        h1 {
            margin: 0;
            margin-right: 10px;
            font-size: 25px;
        }
    }

    .right-side {
        display: flex;
        flex-direction: row;
        flex: 1;
        justify-content: space-between;
        align-items: center;

        > div {
            display: flex;
            flex-direction: row;
            align-items: center;

            button {
                width: 40px;
                height: 40px;
                font-size: 25px;
                margin-right: 15px;
                color: #C5C5C5;
                background-color: transparent;
                border: none;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                i.fas {
                    &:first-child {
                        font-size: 20px; 
                        margin-right: 5px; 
                        color: #C5C5C5;
                    }

                    &:last-child {
                        font-size: 15px; 
                        color: #C5C5C5;
                    }
                }
            }

            &:last-child {
                button {
                    margin-right: unset;
                    
                    i.fas {
                        font-size: unset; 
                    }

                    &:last-child {
                        font-size: 20px;
                    }
                }
            }
        }
    }
}
</style>