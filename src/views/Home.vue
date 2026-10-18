<script setup lang="ts">
  import { publicAsset } from '../assets';
  import { ArrowRight, BookOpen, BadgeCheck, Heart, Sparkles } from 'lucide-vue-next';
  import { facts, people, categories, randomTopic, chronologicalPeople } from '../data';
  import TopicCard from '../components/TopicCard.vue';
  import WelcomeHero from '../components/WelcomeHero.vue';
  import PersonCard from '../components/PersonCard.vue';
  import FactCard from '../components/FactCard.vue';

  const featured = facts.find((f) => f.id === 'kennedy-08')!;
</script>

<template>
  <WelcomeHero />
  <div class="trust-strip">
    <span> <BookOpen :size="17" /> {{ facts.length }} stories worth discovering </span>
    <span> <BadgeCheck :size="17" /> Every fact has a source </span>
    <span> <Heart :size="17" /> Save your favorites </span>
  </div>
  <section class="section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">A FRESH BIT OF HISTORY</span>
        <h2>Well, did you know?</h2>
      </div>
      <RouterLink
        to="/topics?category=random"
        class="text-link"
        >More surprises <ArrowRight :size="17"
      /></RouterLink>
    </div>
    <div class="featured-grid">
      <div class="featured-intro">
        <span
          class="big-spark"
          aria-hidden="true"
          >✦</span
        ><span class="eyebrow">THE UNEXPECTED FILES</span>
        <h3>
          A coconut.<br />
          A message.<br />
          A rescue.
        </h3>
        <p>Sometimes the smallest things have the biggest stories.</p>
        <RouterLink
          to="/person/kennedy"
          class="text-link"
          >Meet John F. Kennedy <ArrowRight :size="16"
        /></RouterLink>
      </div>
      <FactCard
        :fact="featured"
        large
      />
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">MORE THAN A PORTRAIT</span>
        <h2>Meet the presidents</h2>
      </div>
      <RouterLink
        to="/presidents"
        class="text-link"
        >Meet them all <ArrowRight :size="17"
      /></RouterLink>
    </div>
    <div class="people-grid home-people">
      <PersonCard
        v-for="person in chronologicalPeople(people.filter((p) => p.kind === 'president'))"
        :key="person.id"
        :person="person"
      />
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">FOLLOW YOUR CURIOSITY</span>
        <h2>There’s a story for everyone.</h2>
      </div>
      <RouterLink
        to="/topics"
        class="text-link"
        >All topics <ArrowRight :size="17"
      /></RouterLink>
    </div>
    <div class="topic-grid">
      <TopicCard
        v-for="category in categories"
        :key="category.id"
        :topic="category"
        :to="`/topics?category=${category.id}`"
        show-arrow
      />
      <TopicCard
        :topic="randomTopic"
        to="/topics?category=random"
        show-arrow
      />
    </div>
  </section>
  <section class="first-ladies-banner">
    <div class="banner-portraits">
      <img
        :src="publicAsset('/portraits/jacqueline-kennedy.jpg')"
        alt="Jacqueline Kennedy"
      /><img
        :src="publicAsset('/portraits/martha-washington.jpg')"
        alt="Martha Washington"
      />
    </div>
    <div>
      <span class="eyebrow"><Sparkles :size="15" /> ANOTHER SIDE OF THE STORY</span>
      <h2>Remarkable women.<br />Remarkable history.</h2>
      <p>Discover the first ladies and White House hostesses.</p>
    </div>
    <RouterLink
      to="/first-ladies"
      class="button navy"
      >Meet the women <ArrowRight :size="17"
    /></RouterLink>
  </section>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';
  .trust-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 65px;
    padding: 22px 15px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
    color: #62746e;
    > span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    svg {
      color: #68896d;
    }
    @media (max-width: @tablet) {
      gap: 30px;
      font-size: 10px;
    }
    @media (max-width: @mobile) {
      gap: 0;
      justify-content: space-between;
      padding: 17px 0;
      font-size: 8px;
      > span {
        gap: 4px;
        max-width: 105px;
        line-height: 1.45;
      }
      svg {
        width: 14px;
        flex-shrink: 0;
      }
    }
  }
  .featured-grid {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    border: 1px solid #ded9c5;
    border-radius: var(--radius);
    overflow: hidden;
    background: #f0e7cf;
    > :deep(.fact-card) {
      border-radius: 0;
      border: 0;
      padding: 32px 38px;
      box-shadow: none;
    }
    @media (max-width: @mobile) {
      grid-template-columns: 1fr;
      > :deep(.fact-card) {
        padding: 23px 25px;
      }
    }
  }
  .featured-intro {
    padding: 34px 38px;
    position: relative;
    .eyebrow {
      font-size: 9px;
      letter-spacing: 1.1px;
      color: #776748;
    }
    h3 {
      font-size: 35px;
      margin-top: 14px;
    }
    p {
      max-width: 270px;
      font-size: 12px;
      margin-top: 13px;
    }
    .text-link {
      margin-top: 22px;
    }
    @media (max-width: @mobile) {
      padding: 23px 25px;
      h3 {
        margin-top: 8px;
        font-size: 25px;
      }
      h3 br {
        display: initial;
      }
      h3 br:after {
        content: ' ';
      }
      .eyebrow {
        font-size: 8px;
      }
      p {
        font-size: 11px;
        margin-top: 10px;
        max-width: 250px;
      }
      .text-link {
        margin-top: 15px;
        font-size: 10px;
      }
    }
  }
  .big-spark {
    position: absolute;
    right: 36px;
    top: 40px;
    font-size: 65px;
    transform: rotate(15deg);
    color: var(--gold);
    @media (max-width: @mobile) {
      font-size: 35px;
      right: 22px;
      top: 27px;
    }
  }
  .first-ladies-banner {
    background: #e4e9df;
    border: 1px solid #d7dfd0;
    margin: 45px 0 25px;
    padding: 28px 35px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    gap: 35px;
    overflow: hidden;
    .eyebrow {
      color: #6d826e;
      font-size: 9px;
    }
    h2 {
      font-size: 29px;
      margin: 7px 0;
    }
    p {
      font-size: 12px;
    }
    .button {
      margin-left: auto;
      white-space: nowrap;
    }
    @media (max-width: @tablet) {
      gap: 20px;
      padding: 25px;
      h2 {
        font-size: 24px;
      }
      .button {
        font-size: 11px;
        padding: 10px 14px;
      }
    }
    @media (max-width: @mobile) {
      position: relative;
      flex-wrap: wrap;
      padding: 23px;
      gap: 18px;
      margin-top: 30px;
      > div:nth-child(2) {
        flex: 1;
      }
      h2 {
        font-size: 22px;
      }
      .eyebrow {
        font-size: 7px;
        letter-spacing: 0.8px;
      }
      p {
        font-size: 10px;
      }
      .button {
        width: 100%;
        margin-left: 0;
        font-size: 12px;
      }
    }
    @media (max-width: @small-mobile) {
      padding: 18px;
      gap: 12px;
    }
  }
  .banner-portraits {
    display: flex;
    min-width: 170px;
    img {
      width: 100px;
      height: 125px;
      object-fit: cover;
      object-position: 50% 20%;
      border: 6px solid var(--paper);
      border-radius: 70px;
      transform: rotate(-9deg);
      filter: sepia(0.22);
    }
    img + img {
      margin-left: -18px;
      transform: rotate(8deg);
      margin-top: 12px;
    }
    @media (max-width: @tablet) {
      min-width: 120px;
      img {
        width: 76px;
        height: 100px;
      }
    }
    @media (max-width: @mobile) {
      min-width: 100px;
      img {
        width: 65px;
        height: 88px;
        border-width: 4px;
      }
    }
    @media (max-width: @small-mobile) {
      min-width: 85px;
    }
  }
  .home-people {
    @media (max-width: @tablet) {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
      :deep(.person-image-link) {
        height: 145px;
      }
      :deep(.person-card-body) {
        padding: 13px 10px;
      }
      :deep(h3) {
        font-size: 15px;
        min-height: 36px;
      }
      :deep(.person-card-foot) {
        font-size: 8px;
      }
      :deep(.portrait-tag) {
        font-size: 6px;
        left: 7px;
        padding: 4px;
      }
    }
    @media (max-width: @mobile) {
      display: flex;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding-bottom: 12px;
      gap: 13px;
      :deep(.person-card) {
        flex: 0 0 164px;
        scroll-snap-align: start;
      }
      :deep(.person-image-link) {
        height: 187px;
      }
      :deep(.person-card-body) {
        padding: 14px;
      }
      :deep(h3) {
        font-size: 20px;
        min-height: 46px;
      }
      :deep(.person-card-foot) {
        font-size: 9px;
      }
      :deep(.portrait-tag) {
        font-size: 7px;
      }
    }
  }
</style>
