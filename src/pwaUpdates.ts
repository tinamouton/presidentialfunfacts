import { computed, ref, type Ref } from 'vue';

// Keep availability separate from dismissal: Later never discards a waiting worker.
export function createUpdatePrompt(
  available: Ref<boolean>,
  playing: Ref<boolean>,
  activate: () => Promise<void>,
  reload: () => void,
) {
  const dismissed = ref(false);
  const applying = ref(false);
  const reloadPending = ref(false);
  const error = ref('');
  let reloaded = false;
  const visible = computed(
    () => (available.value || reloadPending.value) && !playing.value && !dismissed.value,
  );

  function later() {
    dismissed.value = true;
  }

  function remind() {
    dismissed.value = false;
  }

  function onNeedReload() {
    // Another open tab may activate the worker. Never interrupt this tab's round.
    if (applying.value && !playing.value && !reloaded) {
      reloaded = true;
      reload();
    } else if (!reloaded) {
      applying.value = false;
      reloadPending.value = true;
    }
  }

  async function updateNow() {
    if (playing.value || applying.value) return;
    applying.value = true;
    error.value = '';
    try {
      if (reloadPending.value) onNeedReload();
      else await activate();
    } catch {
      applying.value = false;
      error.value = 'The update could not start. Please try again when you’re online.';
    }
  }

  return { visible, applying, error, later, remind, onNeedReload, updateNow };
}
