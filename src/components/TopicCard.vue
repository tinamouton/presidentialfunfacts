<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import { ArrowRight } from 'lucide-vue-next';
  import type { Category, CategoryId } from '../models';
  import TopicIcon from './TopicIcon.vue';

  withDefaults(
    defineProps<{
      topic: Omit<Category, 'id'> & { id: CategoryId | 'random' };
      to?: string;
      selected?: boolean;
      description?: string;
      showArrow?: boolean;
    }>(),
    { selected: false, showArrow: false },
  );
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    class="topic-card"
    :class="{ chosen: selected }"
    :aria-pressed="to ? undefined : selected"
  >
    <span
      class="topic-symbol"
      :class="topic.color"
      ><TopicIcon :category="topic.id"
    /></span>
    <h3>{{ topic.name }}</h3>
    <p>{{ description ?? topic.description }}</p>
    <ArrowRight
      v-if="showArrow"
      :size="17"
    />
  </component>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';
  .topic-card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 17px;
    padding: 21px 14px;
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    box-shadow: var(--shadow);
    color: var(--navy);
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-4px);
      border-color: #bfae82;
    }
    h3 {
      font-size: 15px;
      letter-spacing: -0.015em;
    }
    p {
      font-size: 10px;
      line-height: 1.65;
      margin-top: 10px;
      flex-grow: 1;
    }
    > svg {
      margin-top: 17px;
      color: #879281;
    }
    &.chosen {
      border-color: var(--red);
      outline: 2px solid var(--red);
      outline-offset: 2px;
    }
    @media (max-width: @desktop) {
      padding: 20px 10px;
      h3 {
        font-size: 14px;
      }
    }
    @media (max-width: @tablet) {
      h3 {
        font-size: 18px;
      }
      p {
        font-size: 11px;
      }
      padding: 22px;
    }
    @media (max-width: @mobile) {
      padding: 18px 14px;
      h3 {
        font-size: 16px;
      }
      p {
        font-size: 10px;
      }
      > svg {
        margin-top: 12px;
      }
    }
  }
  .topic-symbol {
    display: flex;
    width: 57px;
    height: 57px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 28px;
    margin-bottom: 16px;
    color: var(--navy);
    &.gold {
      background: #f6e6bc;
    }
    &.red {
      background: #f1ddd0;
      color: inherit;
    }
    &.blue {
      background: #dbe9e5;
    }
    &.sage {
      background: #e0e8d5;
    }
    @media (max-width: @tablet) {
      width: 62px;
      height: 62px;
    }
    @media (max-width: @mobile) {
      width: 53px;
      height: 53px;
      margin-bottom: 12px;
      font-size: 26px;
    }
  }
</style>
