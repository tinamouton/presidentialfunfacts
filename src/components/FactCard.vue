<script setup lang="ts">
  import { publicAsset } from '../assets';
  import { Heart, ExternalLink, BadgeCheck } from 'lucide-vue-next';
  import { evidenceNotice } from '../editorial';
  import type { Fact } from '../models';
  import TopicIcon from './TopicIcon.vue';
  import { categories, personById, sourceById } from '../data';
  import { useFavorites } from '../stores/favorites';
  defineProps<{ fact: Fact; large?: boolean }>();
  const favorites = useFavorites();
</script>
<template>
  <article
    class="fact-card"
    :class="{ large }"
  >
    <div class="fact-top">
      <span class="pill"
        ><TopicIcon
          :category="fact.category"
          :size="13"
        />
        {{ categories.find((c) => c.id === fact.category)?.name }}</span
      ><button
        class="icon-button"
        :aria-label="`${favorites.saved.facts.includes(fact.id) ? 'Unsave' : 'Save'} fact: ${fact.headline}`"
        :aria-pressed="favorites.saved.facts.includes(fact.id)"
        @click="favorites.toggle('facts', fact.id)"
      >
        <Heart
          :size="21"
          :fill="favorites.saved.facts.includes(fact.id) ? 'currentColor' : 'none'"
        />
      </button>
    </div>
    <p
      v-if="evidenceNotice(fact)"
      class="evidence-notice"
    >
      {{ evidenceNotice(fact) }}
    </p>
    <h3>{{ fact.headline }}</h3>
    <p>{{ fact.description }}</p>
    <RouterLink
      class="fact-person"
      :to="`/person/${fact.personId}`"
      ><img
        :src="publicAsset(personById(fact.personId)?.image.path ?? '')"
        alt=""
        loading="lazy"
      /><span>{{ personById(fact.personId)?.name }}</span></RouterLink
    >
    <div class="source-row">
      <span
        ><BadgeCheck :size="14" />{{
          fact.verification === 'verified' ? 'Source checked' : 'Awaiting review'
        }}</span
      ><a
        :href="sourceById(fact.sourceId).url"
        target="_blank"
        rel="noopener noreferrer"
        >{{ sourceById(fact.sourceId).name }}<ExternalLink :size="13" /><span class="sr-only">
          (opens in a new tab)</span
        ></a
      >
    </div>
  </article>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .fact-card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 25px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow);
    min-width: 0;
    h3 {
      font-size: 24px;
      margin: 22px 0 12px;
    }
    > p {
      font-size: 14px;
      line-height: 1.8;
      color: #536765;
      flex-grow: 1;
    }
    &.large h3 {
      font-size: 33px;
    }
    &.large > p {
      font-size: 18px;
      line-height: 1.65;
      max-width: 600px;
    }
    @media (max-width: @mobile) {
      &.large h3 {
        font-size: 27px;
      }
      &.large > p {
        font-size: 16px;
      }
      h3 {
        font-size: 25px;
        margin-top: 16px;
      }
      > p {
        font-size: 14px;
      }
    }
  }
  .fact-card > .evidence-notice {
    flex-grow: 0;
    color: var(--navy);
    font-weight: 700;
    font-size: 13px;
    border-left: 3px solid var(--gold);
    padding-left: 12px;
    margin: 16px 0 0;
  }
  .fact-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .pill {
    background: #eee8d8;
    font-size: 10px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    svg {
      flex-shrink: 0;
    }
  }
  .fact-person {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 700;
    margin-top: 25px;
    img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
      object-position: 50% 20%;
      filter: sepia(0.18);
    }
    @media (max-width: @mobile) {
      margin-top: 20px;
    }
  }
  .source-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    font-size: 9px;
    color: #687b72;
    > span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      text-align: right;
      max-width: 65%;
      justify-content: flex-end;
    }
    a:hover {
      text-decoration: underline;
    }
    a svg {
      flex-shrink: 0;
    }
    @media (max-width: @mobile) {
      margin-top: 17px;
      font-size: 8px;
    }
  }
</style>
