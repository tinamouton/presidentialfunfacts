<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    ArrowLeft,
    ArrowRight,
    Heart,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
  } from 'lucide-vue-next';
  import { people, facts, relatedPeople } from '../data';
  import { useFavorites } from '../stores/favorites';
  import FactCard from '../components/FactCard.vue';
  const route = useRoute(),
    favorites = useFavorites(),
    index = ref(0);
  const person = computed(() => people.find((p) => p.id === route.params.id));
  const personFacts = computed(() => facts.filter((f) => f.personId === person.value?.id));
  const connections = computed(() => (person.value ? relatedPeople(person.value.id) : []));
  function next(step: number) {
    index.value = (index.value + step + personFacts.value.length) % personFacts.value.length;
  }
  watch(
    () => route.params.id,
    () => {
      index.value = 0;
    },
  );
</script>
<template>
  <template v-if="person"
    ><RouterLink
      :to="person.kind === 'president' ? '/presidents' : '/first-ladies'"
      class="text-link back-link"
      ><ArrowLeft :size="17" /> Back to
      {{ person.kind === 'president' ? 'presidents' : 'first ladies & hostesses' }}</RouterLink
    >
    <section class="person-detail">
      <div class="detail-portrait">
        <img
          :src="person.image.path"
          :alt="`Portrait of ${person.name}`"
        /><span>{{ person.years }}</span>
      </div>
      <div class="detail-copy">
        <span class="eyebrow">{{ person.subtitle }}</span>
        <h1>{{ person.name }}</h1>
        <p>{{ person.biography }}</p>
        <button
          class="button cream"
          :aria-pressed="favorites.saved.people.includes(person.id)"
          @click="favorites.toggle('people', person.id)"
        >
          <Heart
            :size="18"
            :fill="favorites.saved.people.includes(person.id) ? 'currentColor' : 'none'"
          />{{
            favorites.saved.people.includes(person.id) ? 'Saved to favorites' : 'Save this person'
          }}
        </button>
        <div class="connections">
          <span class="eyebrow">PEOPLE IN THEIR STORY</span
          ><RouterLink
            v-for="connection in connections"
            :key="connection.person.id"
            :to="`/person/${connection.person.id}`"
            ><img
              :src="connection.person.image.path"
              alt="" />
            <div>
              <strong>{{ connection.person.name }}</strong
              ><span>{{ connection.relationship.label }}</span>
            </div>
            <ArrowRight :size="18"
          /></RouterLink>
        </div>
      </div>
    </section>
    <section class="section detail-facts">
      <div class="section-heading">
        <div>
          <span class="eyebrow"
            >A DIFFERENT SIDE OF {{ person.name.split(' ').slice(-1)[0].toUpperCase() }}</span
          >
          <h2>Little-known facts. Big discoveries.</h2>
        </div>
        <span class="muted">{{ personFacts.length }} sourced stories</span>
      </div>
      <div
        class="carousel"
        role="region"
        :aria-label="`${person.name} facts carousel`"
        tabindex="0"
        @keydown.left.prevent="next(-1)"
        @keydown.right.prevent="next(1)"
      >
        <div
          aria-live="polite"
          aria-atomic="true"
        >
          <FactCard
            v-if="personFacts[index]"
            :key="personFacts[index].id"
            :fact="personFacts[index]"
            large
          />
        </div>
        <div class="carousel-controls">
          <button
            class="icon-button"
            aria-label="Previous fact"
            @click="next(-1)"
          >
            <ChevronLeft /></button
          ><span>{{ index + 1 }} / {{ personFacts.length }}</span
          ><button
            class="button navy"
            @click="next(1)"
          >
            Next discovery <ChevronRight :size="18" />
          </button>
        </div>
      </div>
    </section>
    <details class="image-credit">
      <summary>Portrait source & rights</summary>
      <p>{{ person.image.attribution }}</p>
      <p>{{ person.image.rights }}</p>
      <a
        :href="person.image.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        >View original image record <ExternalLink :size="14" /><span class="sr-only">
          (opens in a new tab)</span
        ></a
      >
    </details></template
  >
  <div
    v-else
    class="empty-state"
  >
    <h1>This person isn’t in our collection.</h1>
    <RouterLink
      to="/presidents"
      class="button navy"
      >Explore the presidents</RouterLink
    >
  </div>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .back-link {
    margin: 26px 0 27px;
    @media (max-width: @mobile) {
      font-size: 10px;
      margin: 18px 0 20px;
    }
  }
  .person-detail {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 60px;
    border-radius: 25px;
    background: #e7ecdf;
    padding: 35px;
    @media (max-width: @tablet) {
      grid-template-columns: 280px 1fr;
      gap: 30px;
      padding: 28px;
    }
    @media (max-width: @mobile) {
      grid-template-columns: 1fr;
      padding: 20px;
      gap: 23px;
    }
  }
  .detail-portrait {
    position: relative;
    > img {
      width: 100%;
      height: 390px;
      object-fit: cover;
      object-position: 50% 18%;
      border-radius: 18px;
      filter: sepia(0.2);
    }
    > span {
      position: absolute;
      bottom: 16px;
      left: 18px;
      background: var(--paper);
      padding: 7px 17px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 700;
    }
    @media (max-width: @tablet) {
      > img {
        height: 370px;
      }
    }
    @media (max-width: @mobile) {
      > img {
        height: 320px;
        object-position: 50% 16%;
      }
    }
  }
  .detail-copy {
    padding: 15px 15px 10px 0;
    .eyebrow {
      letter-spacing: 1px;
      font-size: 10px;
      color: #718069;
    }
    h1 {
      font-size: 45px;
      margin-top: 14px;
    }
    > p {
      font-size: 15px;
      margin: 20px 0 23px;
      line-height: 1.85;
      max-width: 500px;
    }
    @media (max-width: @tablet) {
      h1 {
        font-size: 37px;
      }
      > p {
        font-size: 13px;
      }
    }
    @media (max-width: @mobile) {
      padding: 0;
      h1 {
        font-size: 37px;
        margin-top: 11px;
      }
      > p {
        font-size: 13px;
        margin-top: 15px;
      }
      .eyebrow {
        font-size: 9px;
      }
      .button {
        font-size: 12px;
      }
    }
  }
  .connections {
    margin-top: 30px;
    > a {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-top: 12px;
    }
    img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      object-position: 50% 20%;
      border-radius: 50%;
      border: 3px solid var(--paper);
    }
    strong {
      font-size: 13px;
    }
    span {
      display: block;
      font-size: 10px;
      color: var(--muted);
    }
    svg {
      margin-left: 15px;
    }
    @media (max-width: @mobile) {
      margin-top: 25px;
    }
  }
  .detail-facts {
    .carousel {
      max-width: 760px;
      margin: auto;
    }
    @media (max-width: @mobile) {
      .section-heading {
        align-items: flex-start;
      }
      h2 {
        font-size: 25px;
        max-width: 230px;
      }
      .section-heading > .muted {
        font-size: 10px;
        margin-top: 26px;
        text-align: right;
      }
    }
    @media (max-width: @small-mobile) {
      h2 {
        font-size: 23px;
      }
    }
  }
  .carousel {
    :deep(.fact-card) {
      padding: 35px 40px;
    }
    @media (max-width: @mobile) {
      :deep(.fact-card) {
        padding: 25px;
      }
    }
  }
  .carousel-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    margin-top: 18px;
    > span {
      font-size: 12px;
      color: var(--muted);
      margin-right: auto;
    }
    @media (max-width: @mobile) {
      > .button {
        font-size: 12px;
        padding: 10px 15px;
      }
    }
  }
  .image-credit {
    font-size: 12px;
    color: var(--muted);
    margin: 35px auto 0;
    max-width: 760px;
    padding: 16px;
    border-top: 1px solid var(--line);
    summary {
      cursor: pointer;
      font-weight: 700;
    }
    p {
      margin-top: 12px;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin-top: 10px;
      text-decoration: underline;
    }
    @media (max-width: @mobile) {
      font-size: 10px;
    }
  }
</style>
