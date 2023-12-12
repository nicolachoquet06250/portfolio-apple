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
        extension: null,
        parent: '/',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Applications',
        extension: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'AirDrop',
        extension: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Desktop',
        extension: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Images',
        extension: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Videos',
        extension: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Documents',
        extension: null,
        parent: '/nchoquet',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'Downloads',
        extension: null,
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
        extension: null,
        parent: '/Documents',
        content: null,
        type: 'directory',
        creation_date: new Date(),
        updated_date: new Date(),
        opened_date: new Date()
    },
    {
        name: 'portfolio-apple',
        extension: null,
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