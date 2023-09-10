<script setup lang="ts">
import { appEnv } from '../../../env/env'
import { Episode } from './types'
import { Character } from '../Character/types'
import BackIcon from '../../../assets/back-icon.svg'
import Loader from '../shared/loader/Loader.vue'

const episodeId = useRoute().params.episode

const episode = ref<Episode>() 
const errorMsg = ref<string|null>(null)
const personImages = ref<{ personLink: string; imageUrl: string; }[]>([])

const { data: episodeData, error, pending } = await useFetch<Episode>(`${appEnv.api}/episode/${+episodeId}`,)
episode.value = episodeData.value!
errorMsg.value = error.value ? `Ошибка при поиске эпизода с ID ${episodeId}` : ''

if (!errorMsg.value) personImages.value = await Promise.all(
    episode!.value.characters.map(async (url) => {
        const imageUrl = await useFetch<Character>(url)
        return {
            personLink: url.split('/').at(-1)!,
            imageUrl: imageUrl.data.value!.image,
        }
    }),
)

</script>
<template>
    <button @click="$router.back()">
        <img :src="BackIcon" alt="back" />
    </button>
    <h1 v-if="errorMsg">{{ errorMsg }}</h1>
    <Loader v-if="pending" />
    <div v-if="!pending && !errorMsg" class="flex flex-col gap-2">
        <h1>Название эпизода: {{ episodeData!.name }}</h1>
        <h1>Дата премьеры: {{ episodeData!.air_date }}</h1>
        <h1>Персонажи, учавствовашие в эпизоде:</h1>
        <div class="grid grid-cols-5 gap-5">
            <NuxtLink v-for="personImage of personImages" :to="`/character/${personImage.personLink}`">
                <img :src="personImage.imageUrl" alt="person" />
            </NuxtLink>
        </div>
    </div>
</template>
