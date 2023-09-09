import { defineStore } from 'pinia'
import { CharacterData } from '~/src/components/Home/types'

export const characterStore = defineStore('main', {
    state: () => ({
        characterData: null as CharacterData | null,
    }),
    actions: {
        updateCharacterData(data: CharacterData) {
            this.characterData = data
        }
    },
    persist: {
        storage: persistedState.localStorage,
    }
})
