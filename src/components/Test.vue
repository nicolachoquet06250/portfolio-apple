<template>
    <div></div>
</template>

<script setup lang="ts">
import { useDatabase } from '@/hooks/database/hooks';

const { addTreeStructures } =
    useDatabase('portfolio-apple', 'treeStructure');

addTreeStructures(
    {
      user_id: 1,
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
      user_id: 1,
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
      user_id: 1,
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
      user_id: 1,
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
      user_id: 1,
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
      user_id: 1,
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
      user_id: 1,
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
      user_id: 1,
      name: 'Downloads',
      extension: null,
      parent: '/nchoquet',
      content: null,
      type: 'directory',
      creation_date: new Date(),
      updated_date: new Date(),
      opened_date: new Date()
    }
);
</script>