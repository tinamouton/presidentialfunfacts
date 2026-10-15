<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Shuffle, ArrowRight } from 'lucide-vue-next';
  import { facts, categories } from '../data';
  import type { CategoryId } from '../models';
  import { filterFacts, randomFact } from '../utils';
  import FactCard from './FactCard.vue';
  const category = ref<CategoryId | ''>(''),
    current = ref(randomFact(facts)!);
  const pool = computed(() => filterFacts(facts, { category: category.value }));
  function shuffle() {
    current.value = randomFact(pool.value, current.value.id)!;
  }
</script>
<template>
  <section class="random-stage">
    <img
      src="/mascot.svg"
      class="random-mascot"
      alt="Captain Facts"
    /><span
      class="random-star"
      aria-hidden="true"
      >✦</span
    >
    <div
      class="random-fact"
      aria-live="polite"
      aria-atomic="true"
    >
      <FactCard
        :key="current.id"
        :fact="current"
        large
      />
    </div>
    <div class="random-actions">
      <button
        class="button red"
        @click="shuffle"
      >
        <Shuffle :size="20" /> Another surprise!</button
      ><label class="random-filter"
        ><span>Surprise me with</span
        ><select
          v-model="category"
          @change="shuffle"
        >
          <option value="">anything</option>
          <option
            v-for="topic in categories"
            :key="topic.id"
            :value="topic.id"
          >
            {{ topic.name.toLowerCase() }}
          </option>
        </select></label
      ><RouterLink
        :to="`/person/${current.personId}`"
        class="text-link"
        >Explore their story <ArrowRight :size="17"
      /></RouterLink>
    </div>
  </section>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .random-stage {
    position: relative;
    max-width: 650px;
    margin: 179px auto 70px;
    @media (max-width: @mobile) {
      margin-top: 158px;
    }
  }
  .random-mascot {
    position: absolute;
    width: 190px;
    top: -147px;
    left: calc(50% - 95px);
    z-index: 0;
    @media (max-width: @mobile) {
      width: 169px;
      top: -126px;
      left: calc(50% - 84px);
    }
  }
  .random-star {
    position: absolute;
    right: 35px;
    top: -85px;
    font-size: 47px;
    color: var(--gold);
    @media (max-width: @mobile) {
      right: 11px;
      top: -73px;
      font-size: 35px;
    }
  }
  .random-fact {
    position: relative;
    z-index: 1;
    :deep(.fact-card) {
      padding: 35px 40px;
      border: 1px solid #d4dcca;
      box-shadow: 0 12px 35px #12364a10;
      min-height: 310px;
    }
    :deep(h3) {
      font-size: 38px !important;
    }
    @media (max-width: @mobile) {
      :deep(.fact-card) {
        padding: 26px;
        min-height: 310px;
      }
      :deep(h3) {
        font-size: 32px !important;
      }
      &.large > p {
        font-size: 16px;
      }
    }
  }
  .random-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 24px;
    > .button {
      width: 100%;
      font-size: 15px;
      min-height: 52px;
    }
    @media (max-width: @mobile) {
      gap: 18px;
      > .button {
        font-size: 14px;
      }
    }
  }
  .random-filter {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    select {
      font-weight: 700;
      border-bottom: 1px solid var(--line);
      padding: 5px 0;
    }
  }
</style>
