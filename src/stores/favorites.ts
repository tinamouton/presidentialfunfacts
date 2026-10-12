import { defineStore } from 'pinia';
import { ref } from 'vue';
import { parseFavorites, STORAGE_KEY, toggleId, type SavedItems } from '../utils';
export const useFavorites = defineStore('favorites', () => {
  const saved = ref<SavedItems>({ people: [], facts: [] });
  const storageError = ref('');
  function load() {
    try {
      saved.value = parseFavorites(localStorage.getItem(STORAGE_KEY));
    } catch {
      storageError.value =
        'Your browser is blocking saved favorites. You can still save for this visit.';
    }
  }
  function toggle(kind: keyof SavedItems, id: string) {
    saved.value[kind] = toggleId(saved.value[kind], id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.value));
      storageError.value = '';
    } catch {
      storageError.value = 'Favorites are saved for this visit. Browser storage is unavailable.';
    }
  }
  load();
  return { saved, toggle, storageError, load };
});
