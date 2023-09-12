<script setup lang="ts">
import { CharacterData } from "./types";

import { characterStore } from '@/stores/store'

import { appEnv } from "@/env";

import HomeCharacter from "./HomeCharacter.vue";
import Input from "@/src/components/shared/Input.vue";

const store = characterStore()
const characters = ref<CharacterData | null>(store.characterData);

const name = ref("");
const species = ref("");
const errorMsg = ref<string | null>(null)

if (characters.value === null) {
    const { data: newCharacters } = await useFetch<CharacterData>("https://rickandmortyapi.com/api/character/?page=1")
    characters.value = newCharacters.value!
}

onMounted(() => {
    window.addEventListener('scroll', scrollHandler)
    if (!store.characterData) store.updateCharacterData(characters.value!)
});

onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler)
})

watch([name, species], async () => {
    const nameVal = name.value;
    const speciesVal = species.value;
    const { data: newCharacters, pending, error } = await useFetch<CharacterData>(
        `${appEnv.api}/character/?page=1${(speciesVal !== "" ? "&status=" + speciesVal : "") + (nameVal !== "" ? "&name=" + nameVal : "")}`
    );
    characters.value = newCharacters.value!;
    const errorVal = error.value
    if (errorVal) errorMsg.value = 'Персонаж не найден!'
    else errorMsg.value = null
})

const scrollHandler = () => {
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
    if (bottomOfWindow) loadData();
}

const loadData = async () => {
    const nextLink = characters.value?.info.next;
    if (!nextLink) return;
    const { data: newCharacters } = await useFetch<CharacterData>(nextLink);
    characters.value!.info.next = newCharacters.value!.info.next;
    characters.value!.results.push(...newCharacters.value!.results);
};

</script>
<template>
    <form class="mb-5 flex gap-5">
        <input class="p-3 border-black border border-solid rounded outline-none" type="text" v-model="name" placeholder="Имя персонажа" />
        <select v-model="species" class="outline-none border-black border border-solid p-3 rounded w-fit">
            <option selected disabled value="">Статус</option>
            <option value="alive">Жив</option>
            <option value="dead">Мертв</option>
            <option value="unknown">Неизвестный</option>
        </select>
    </form>
    <h1 v-if="errorMsg" class="text-lg">{{ errorMsg }}</h1>
    <div class="grid grid-cols-2 gap-3">
        <h1 v-if="characters?.results.length === 0">Персонажены не найдены</h1>
        <HomeCharacter v-if="characters?.results" v-for="({ name, species, image, episode, id }, index) in characters.results" :key="index" :name="name" :species="species" :image="image"
            :episodes="episode" :id="id" />
    </div>
</template>
../../../env~/env