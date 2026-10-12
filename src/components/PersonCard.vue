<script setup lang="ts">
  import { Heart, ArrowUpRight } from 'lucide-vue-next';
  import type { Person } from '../models';
  import { useFavorites } from '../stores/favorites';
  import { facts } from '../data';
  defineProps<{ person: Person }>();
  const favorites = useFavorites();
</script>
<template>
  <article class="person-card">
    <RouterLink
      :to="`/person/${person.id}`"
      class="person-image-link"
      ><img
        :src="person.image.path"
        :alt="`Portrait of ${person.name}`"
        loading="lazy" /><span class="portrait-tag">{{
        person.kind === 'hostess'
          ? 'WHITE HOUSE HOSTESS'
          : person.kind === 'first-lady'
            ? 'FIRST LADY'
            : person.subtitle.split(' · ')[0].toUpperCase()
      }}</span></RouterLink
    >
    <button
      class="save-person icon-button"
      :aria-label="`${favorites.saved.people.includes(person.id) ? 'Unsave' : 'Save'} ${person.name}`"
      :aria-pressed="favorites.saved.people.includes(person.id)"
      @click="favorites.toggle('people', person.id)">
      <Heart
        :size="19"
        :fill="favorites.saved.people.includes(person.id) ? 'currentColor' : 'none'" />
    </button>
    <div class="person-card-body">
      <span class="eyebrow muted">{{ person.years }}</span
      ><RouterLink :to="`/person/${person.id}`"
        ><h3>{{ person.name }}</h3></RouterLink
      >
      <div class="person-card-foot">
        <span>{{ facts.filter((f) => f.personId === person.id).length }} little-known facts</span
        ><RouterLink
          :to="`/person/${person.id}`"
          :aria-label="`Explore ${person.name}`"
          ><ArrowUpRight :size="20"
        /></RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .person-card {
    position: relative;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 17px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-4px);
    }
    &:hover .person-image-link > img {
      transform: scale(1.04);
    }
    .eyebrow {
      font-size: 9px;
      letter-spacing: 0.6px;
    }
    h3 {
      font-size: 19px;
      margin: 7px 0 15px;
      min-height: 44px;
    }
    @media (max-width: @desktop) {
      h3 {
        font-size: 17px;
      }
    }
    @media (max-width: @mobile) {
      h3 {
        font-size: 20px;
        min-height: 46px;
      }
    }
  }
  .person-image-link {
    display: block;
    position: relative;
    background: #e4d7b8;
    height: 202px;
    overflow: hidden;
    > img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: 50% 18%;
      filter: sepia(0.2) saturate(0.75);
      transition: transform 0.3s;
    }
    @media (max-width: @desktop) {
      height: 180px;
    }
    @media (max-width: @mobile) {
      height: 205px;
    }
    @media (max-width: @small-mobile) {
      height: 180px;
    }
  }
  .portrait-tag {
    position: absolute;
    left: 10px;
    bottom: 11px;
    background: #fcf6e9ec;
    border-radius: 6px;
    padding: 4px 7px;
    font-size: 7px;
    letter-spacing: 0.5px;
    font-weight: 800;
  }
  .save-person {
    position: absolute;
    right: 10px;
    top: 10px;
    background: #fffaf0e8;
    border: none;
    width: 38px;
    height: 38px;
  }
  .person-card-body {
    padding: 17px 15px 12px;
    @media (max-width: @mobile) {
      padding: 15px 13px 12px;
    }
  }
  .person-card-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    font-size: 9px;
    color: #7b7b6b;
    border-top: 1px solid var(--line);
    padding-top: 11px;
    a {
      display: flex;
      color: var(--red);
    }
  }
</style>
