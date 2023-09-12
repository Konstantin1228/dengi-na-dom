<script setup lang="ts">
import { HomeCharacterProps } from "./types";
const props = defineProps<HomeCharacterProps>();

</script> 

<template>
    <div class="flex gap-4 shadow p-1 justify-between rounded">
        <img class="rounded" :src="props.image" :alt="props.name" />
        <div class="text-right">
            <NuxtLink class="text-xl font-bold" :to="`character/${props.id}`">{{ props.name }}</NuxtLink>
            <h3 class="">{{ props.species }}</h3>
            <dl>
                <li v-for="(episode, index) in props.episodes.slice(0, 5)" :key="index">
                    <NuxtLink :href="`episode/${episode.at(-1)!}`">Эпизод {{ episode.at(-1)! }}</NuxtLink>
                </li>
            </dl>
        </div>
    </div>
</template>
