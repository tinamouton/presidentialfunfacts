import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameActivity = defineStore('gameActivity', () => {
  const active = ref(false);

  return { active };
});
