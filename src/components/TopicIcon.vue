<script setup lang="ts">
  import { Sprout, House, Compass, Feather, Star, ScrollText } from 'lucide-vue-next';
  import type { CategoryId } from '../models';
  withDefaults(defineProps<{ category: CategoryId; size?: number }>(), { size: 27 });
  const icons = {
    'early-life': Sprout,
    family: House,
    adventures: Compass,
    arts: Feather,
    firsts: Star,
    legacy: ScrollText,
  };
</script>
<template>
  <component
    :is="icons[category]"
    :size="size"
    :stroke-width="1.6"
    aria-hidden="true"
  />
</template>
