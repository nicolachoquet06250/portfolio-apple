<template>
    <div></div>
</template>

<script setup lang="ts">
import { useDatabase } from '@/hooks/database';

const { 
    onUpgradeNeeded, 
    onSuccess, 
    connect
} = useDatabase('portfolio-apple', 'tree-structure');

type TestEvent = {
  context: {
    add(...item: any[]): void
  }
}

onUpgradeNeeded(({ context: { add } }: TestEvent) => {
    add({
        name: 'nchoquet',
        extention: null,
        parent: '/',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Applications',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'AirDrop',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Desktop',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Images',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Videos',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Documents',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Downloads',
        extention: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    });
});

onSuccess((/*{ context: { add, remove, get, getAllValues, getAllKeys } }*/) => {
    /*add({
        name: 'Projects-2020',
        extention: null,
        parent: '/Documents',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'portfolio-apple',
        extention: null,
        parent: '/Documents/Projects-2020',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    });

    const result = get(1);
    const result2 = getAllValues();
    const result3 = getAllKeys();
    
    remove(17, 18);

    watch(result, () => {
        console.log(result.value);
    });
    watch(result2, () => {
        console.log(result2.value);
    });
    watch(result3, () => {
        console.log(result3.value);
    })*/
});

connect();
</script>