<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { Search, X, Heart, ArrowRight, SlidersHorizontal } from 'lucide-vue-next';
  import { people, facts, categories } from '../data';
  import type { CategoryId } from '../models';
  import { filterFacts } from '../utils';
  import { useFavorites } from '../stores/favorites';
  import TopicCard from '../components/TopicCard.vue';
  import PersonCard from '../components/PersonCard.vue';
  import FactCard from '../components/FactCard.vue';
  const props = defineProps<{ mode: 'presidents' | 'first-ladies' | 'topics' | 'favorites' }>();
  const route = useRoute(),
    favorites = useFavorites(),
    query = ref(''),
    category = ref<CategoryId | ''>(''),
    savedTab = ref<'facts' | 'people'>('facts'),
    sort = ref('chronological');
  watch(
    () => [props.mode, route.query.category],
    () => {
      query.value = '';
      category.value = categories.some((c) => c.id === route.query.category)
        ? (route.query.category as CategoryId)
        : '';
    },
    { immediate: true },
  );
  const title = computed(
    () =>
      ({
        presidents: 'Meet the presidents.',
        'first-ladies': 'Meet the women.',
        topics: 'Follow your curiosity.',
        favorites: 'Your little history collection.',
      })[props.mode],
  );
  const subtitle = computed(
    () =>
      ({
        presidents: 'Big names. Human stories. A few things you never learned in school.',
        'first-ladies': 'The spouses and hostesses who shaped life in the presidential home.',
        topics: 'Choose a subject and find a story that surprises you.',
        favorites: 'Keep the people and stories you want to come back to.',
      })[props.mode],
  );
  const listPeople = computed(() => {
    const list = people.filter(
      (p) =>
        (props.mode === 'favorites'
          ? favorites.saved.people.includes(p.id)
          : props.mode === 'presidents'
            ? p.kind === 'president'
            : p.kind !== 'president') &&
        `${p.name} ${p.subtitle} ${p.years}`
          .toLowerCase()
          .includes(query.value.toLowerCase().trim()),
    );
    return sort.value === 'name' ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  });
  const listFacts = computed(() =>
    filterFacts(
      props.mode === 'favorites'
        ? facts.filter((f) => favorites.saved.facts.includes(f.id))
        : facts,
      { query: query.value, category: category.value },
    ),
  );
  const showPeople = computed(
    () =>
      props.mode === 'presidents' ||
      props.mode === 'first-ladies' ||
      (props.mode === 'favorites' && savedTab.value === 'people'),
  );
</script>
<template>
  <div class="page-head">
    <span class="eyebrow">{{
      mode === 'favorites'
        ? 'SAVED WITH A LITTLE LOVE'
        : mode === 'topics'
          ? 'SO MANY WAYS TO EXPLORE'
          : 'THE PEOPLE BEHIND THE HISTORY'
    }}</span>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </div>
  <div
    v-if="mode === 'first-ladies'"
    class="info-note"
  >
    <span>✦</span>
    <p>
      <strong>First ladies & White House hostesses</strong><br />Martha Jefferson Randolph was
      Jefferson’s daughter and an occasional hostess. The other women in this collection were
      presidential spouses.
    </p>
  </div>
  <div
    v-if="mode === 'favorites'"
    class="segmented"
    aria-label="Favorite types"
  >
    <button
      :class="{ selected: savedTab === 'facts' }"
      :aria-pressed="savedTab === 'facts'"
      @click="savedTab = 'facts'"
    >
      Facts <span>{{ favorites.saved.facts.length }}</span></button
    ><button
      :class="{ selected: savedTab === 'people' }"
      :aria-pressed="savedTab === 'people'"
      @click="savedTab = 'people'"
    >
      People <span>{{ favorites.saved.people.length }}</span>
    </button>
  </div>
  <div
    v-if="mode === 'topics'"
    class="topic-grid browse-topics"
  >
    <TopicCard
      v-for="topic in categories"
      :key="topic.id"
      :topic="topic"
      :selected="category === topic.id"
      :description="`${facts.filter((fact) => fact.category === topic.id).length} stories to discover`"
      @click="category = category === topic.id ? '' : topic.id" />
  </div>
  <div class="filter-row">
    <label class="search-field"
      ><Search :size="20" /><span class="sr-only">Search {{ showPeople ? 'people' : 'facts' }}</span
      ><input
        v-model="query"
        :placeholder="
          showPeople
            ? 'Search names, administrations, or years…'
            : 'Search people, stories, or ideas…'
        " /><button
        v-if="query"
        class="icon-button"
        aria-label="Clear search"
        @click="query = ''">
        <X :size="17" /></button></label
    ><label
      v-if="showPeople"
      class="sort-field"
      ><SlidersHorizontal :size="17" /><span class="sr-only">Sort people</span
      ><select v-model="sort">
        <option value="chronological">Historical order</option>
        <option value="name">Name A–Z</option>
      </select></label
    ><label
      v-else
      class="sort-field"
      ><span class="sr-only">Filter by topic</span
      ><select v-model="category">
        <option value="">All topics</option>
        <option
          v-for="topic in categories"
          :key="topic.id"
          :value="topic.id">
          {{ topic.name }}
        </option>
      </select></label
    >
  </div>
  <div
    class="results-label"
    role="status">
    {{ showPeople ? listPeople.length : listFacts.length }} {{ showPeople ? 'people' : 'stories' }}
    {{ query ? 'found' : 'to discover'
    }}<button
      v-if="query || category"
      class="text-link"
      @click="
        query = '';
        category = '';
      ">
      Clear filters <X :size="14" />
    </button>
  </div>
  <div
    v-if="showPeople && listPeople.length"
    class="people-grid">
    <PersonCard
      v-for="person in listPeople"
      :key="person.id"
      :person="person" />
  </div>
  <div
    v-else-if="!showPeople && listFacts.length"
    class="facts-grid">
    <FactCard
      v-for="fact in listFacts"
      :key="fact.id"
      :fact="fact" />
  </div>
  <div
    v-else
    class="empty-state">
    <Heart
      v-if="mode === 'favorites'"
      :size="42" /><Search
      v-else
      :size="42" />
    <h2>
      {{
        mode === 'favorites' && !query && !category
          ? 'Make room for a little history.'
          : 'No stories found just yet.'
      }}
    </h2>
    <p>
      {{
        mode === 'favorites'
          ? 'Tap the heart on any person or fact to save it here.'
          : 'Try another name or clear your filters to explore again.'
      }}
    </p>
    <RouterLink
      v-if="mode === 'favorites'"
      to="/presidents"
      class="button navy"
      >Start exploring <ArrowRight :size="18" /></RouterLink
    ><button
      v-else
      class="button navy"
      @click="
        query = '';
        category = '';
      ">
      Clear filters
    </button>
  </div>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .filter-row {
    display: flex;
    gap: 15px;
    margin-bottom: 18px;
    @media (max-width: @mobile) {
      flex-wrap: wrap;
      gap: 10px;
    }
  }
  .search-field {
    border: 1px solid var(--line);
    display: flex;
    gap: 12px;
    background: var(--paper);
    border-radius: 12px;
    padding: 5px 15px;
    align-items: center;
    flex: 1;
    min-width: 0;
    > svg {
      color: #7e8c85;
      flex-shrink: 0;
    }
    input {
      border: 0;
      background: none;
      width: 100%;
      padding: 10px 0;
      font-size: 13px;
      color: var(--navy);
      min-width: 0;
    }
    input:focus {
      outline: none;
    }
    &:focus-within {
      outline: 2px solid #267e9b;
      outline-offset: 2px;
    }
    .icon-button {
      border: 0;
      width: 30px;
      height: 30px;
    }
    @media (max-width: @mobile) {
      flex-basis: 100%;
      padding: 4px 12px;
      input {
        font-size: 12px;
      }
    }
  }
  .sort-field {
    display: flex;
    gap: 8px;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 0 13px;
    background: var(--paper);
    @media (max-width: @mobile) {
      min-height: 36px;
      padding: 0 12px;
      margin-left: auto;
      select {
        padding-top: 7px;
        padding-bottom: 7px;
        font-size: 11px;
      }
    }
  }
  .results-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--muted);
    margin: 20px 0;
    @media (max-width: @mobile) {
      margin-top: 14px;
    }
  }
  .facts-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    :deep(.fact-card) {
      min-height: 310px;
    }
    @media (max-width: @tablet) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (max-width: @mobile) {
      grid-template-columns: 1fr;
      :deep(.fact-card) {
        min-height: 0;
        padding: 24px;
      }
    }
  }
  .browse-topics {
    margin: 0 0 30px;
    @media (max-width: @mobile) {
      margin-bottom: 25px;
      :deep(.topic-card) {
        padding: 15px 10px;
      }
      :deep(.topic-symbol) {
        width: 40px;
        height: 40px;
        font-size: 23px;
        margin-bottom: 9px;
      }
      :deep(h3) {
        font-size: 15px;
      }
      :deep(p) {
        font-size: 9px;
        margin-top: 7px;
      }
    }
  }
  .info-note {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 18px 24px;
    background: #eee9d7;
    border-radius: 15px;
    margin-bottom: 27px;
    font-size: 12px;
    > span {
      font-size: 27px;
      color: var(--gold);
    }
    strong {
      color: var(--navy);
    }
    @media (max-width: @mobile) {
      padding: 15px;
      font-size: 10px;
      align-items: flex-start;
      gap: 10px;
    }
  }
  .segmented {
    display: inline-flex;
    gap: 4px;
    background: #ece4d1;
    padding: 5px;
    border-radius: 12px;
    margin-bottom: 25px;
    button {
      border: 0;
      background: none;
      border-radius: 9px;
      padding: 9px 22px;
      font-size: 12px;
      font-weight: 700;
    }
    button.selected {
      background: var(--navy);
      color: var(--paper);
    }
    span {
      margin-left: 5px;
      opacity: 0.7;
    }
    @media (max-width: @mobile) {
      margin-bottom: 20px;
    }
  }
</style>
