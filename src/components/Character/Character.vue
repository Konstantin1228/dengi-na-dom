<script setup lang="ts">
import { appEnv } from "@/env/";

import { Character } from "./types";

import BackIcon from "@/assets/back-icon.svg";

import Loader from '@/src/components/shared/loader/Loader.vue'

const characterId = useRoute().params.character;
const character = ref<Character>();
const errorMsg = ref('')

const { data: characterData, error, pending } = await useFetch<Character>(`${appEnv.api}/character/${+characterId}`);
errorMsg.value = error.value ? `Ошибка при поиске персонажа с ID ${characterId}` : ''
character.value = characterData.value!;

</script>
<template>
    <button @click="$router.back()">
        <img :src="BackIcon" alt="back" />
    </button>
    <h1 v-if="errorMsg">{{ errorMsg }}</h1>
    <Loader v-if="pending" />
    <div v-if="!pending && !errorMsg" class="flex gap-5 mt-5 text-right">
        <img :src="characterData!.image" alt="" />
        <div>
            <h1 class="text-xl font-bold">{{ character!.name }}</h1>
            <h3 class="">{{ character!.species }}</h3>
            <h3>{{ character!.location.name }}</h3>
        </div>
    </div>
</template>
../../../env