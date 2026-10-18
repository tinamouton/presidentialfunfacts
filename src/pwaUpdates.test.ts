import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { createUpdatePrompt } from './pwaUpdates';
import { useFavorites } from './stores/favorites';
import { STORAGE_KEY } from './utils';

function setup() {
  const available = ref(false);
  const playing = ref(false);
  const activate = vi.fn(async () => {});
  const reload = vi.fn();
  const prompt = createUpdatePrompt(available, playing, activate, reload);
  return { available, playing, activate, reload, prompt };
}

describe('prompted updates', () => {
  it('defers repeated events during gameplay and becomes eligible on completion or exit', () => {
    const { available, playing, prompt, activate } = setup();
    playing.value = true;
    available.value = true;
    available.value = true;
    expect(prompt.visible.value).toBe(false);
    void prompt.updateNow();
    expect(activate).not.toHaveBeenCalled();
    playing.value = false;
    expect(prompt.visible.value).toBe(true);
    playing.value = true;
    expect(prompt.visible.value).toBe(false);
    playing.value = false;
    expect(prompt.visible.value).toBe(true);
  });

  it('Later keeps the update available until a foreground reminder or normal launch', () => {
    const { available, prompt, activate, reload } = setup();
    available.value = true;
    prompt.later();
    available.value = true;
    expect(prompt.visible.value).toBe(false);
    expect(available.value).toBe(true);
    expect(activate).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
    prompt.remind();
    expect(prompt.visible.value).toBe(true);
  });

  it('activates only on acceptance, prevents duplicate clicks, and reloads once', async () => {
    const { available, prompt, activate, reload } = setup();
    available.value = true;
    expect(reload).not.toHaveBeenCalled();
    await prompt.updateNow();
    await prompt.updateNow();
    expect(activate).toHaveBeenCalledTimes(1);
    expect(reload).not.toHaveBeenCalled();
    prompt.onNeedReload();
    prompt.onNeedReload();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('defers reload when another tab activates a worker during a round', async () => {
    const { playing, prompt, reload, activate } = setup();
    playing.value = true;
    prompt.onNeedReload();
    expect(reload).not.toHaveBeenCalled();
    expect(prompt.visible.value).toBe(false);
    playing.value = false;
    expect(prompt.visible.value).toBe(true);
    await prompt.updateNow();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(activate).not.toHaveBeenCalled();
  });

  it('protects a round started while an accepted update is activating', async () => {
    const { playing, prompt, reload } = setup();
    await prompt.updateNow();
    playing.value = true;
    prompt.onNeedReload();
    expect(reload).not.toHaveBeenCalled();
    playing.value = false;
    expect(prompt.applying.value).toBe(false);
    await prompt.updateNow();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('allows retry after activation errors', async () => {
    const { prompt, activate } = setup();
    activate.mockRejectedValueOnce(new Error('offline'));
    await prompt.updateNow();
    expect(prompt.error.value).not.toBe('');
    expect(prompt.applying.value).toBe(false);
    await prompt.updateNow();
    expect(activate).toHaveBeenCalledTimes(2);
  });

  it('preserves existing favorites through initialization, dismissal, and activation', async () => {
    const saved = JSON.stringify({ people: ['lincoln', 'john-adams'], facts: ['lincoln-01'] });
    const storage = { getItem: vi.fn(() => saved), setItem: vi.fn(), clear: vi.fn() };
    vi.stubGlobal('localStorage', storage);
    try {
      setActivePinia(createPinia());
      const favorites = useFavorites();
      expect(storage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(favorites.saved).toEqual(JSON.parse(saved));
      const { prompt } = setup();
      prompt.later();
      prompt.remind();
      await prompt.updateNow();
      prompt.onNeedReload();
      expect(storage.clear).not.toHaveBeenCalled();
      expect(storage.setItem).not.toHaveBeenCalled();
      favorites.load();
      expect(favorites.saved).toEqual(JSON.parse(saved));
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
