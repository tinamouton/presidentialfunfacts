<script setup lang="ts">
  import { computed, nextTick, ref } from 'vue';
  import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-vue-next';
  import { facts, personById, sourceById } from '../data';
  import { whoAmIQuestions } from '../data/whoAmI';
  import { createRound, isCorrectAnswer } from '../games';

  const round = ref(createRound(whoAmIQuestions));
  const index = ref(0);
  const selected = ref<string | null>(null);
  const heading = ref<HTMLElement | null>(null);
  const question = computed(() => round.value[index.value]);
  const complete = computed(() => index.value === round.value.length);
  const answer = computed(() => personById(question.value?.answerPersonId));
  const source = computed(() => {
    const fact = facts.find((item) => item.id === question.value?.sourceFactId);
    return fact ? sourceById(fact.sourceId) : undefined;
  });
  const feedback = computed(() => {
    if (!selected.value || !question.value) return '';
    return isCorrectAnswer(question.value, selected.value)
      ? 'You got it! Excellent detective work!'
      : `Good guess! It was ${answer.value?.name}!`;
  });

  function selectAnswer(personId: string) {
    if (selected.value === null) selected.value = personId;
  }

  async function focusHeading() {
    await nextTick();
    heading.value?.focus();
  }

  function advance() {
    if (selected.value === null || complete.value) return;
    index.value++;
    selected.value = null;
    void focusHeading();
  }

  function restart() {
    round.value = createRound(whoAmIQuestions);
    index.value = 0;
    selected.value = null;
    void focusHeading();
  }
</script>

<template>
  <RouterLink
    to="/games"
    class="text-link back-link"
    ><ArrowLeft :size="18" /> Fun &amp; Games</RouterLink
  >

  <section class="adventure">
    <div
      v-if="complete"
      class="completion"
    >
      <img
        src="/mascot.svg"
        alt="Captain Facts celebrates your adventure"
      />
      <h1
        ref="heading"
        tabindex="-1"
      >
        Huzzah! You’ve completed your historical adventure!
      </h1>
      <p>There’s always another story waiting to be discovered.</p>
      <button
        class="button navy"
        @click="restart"
      >
        Play Again
      </button>
      <RouterLink
        to="/games"
        class="button cream"
        >Back to Fun &amp; Games</RouterLink
      >
    </div>

    <template v-else>
      <header class="game-heading">
        <div>
          <span class="eyebrow">WHO AM I?</span>
          <h1
            ref="heading"
            tabindex="-1"
          >
            Question {{ index + 1 }} of {{ round.length }}
          </h1>
        </div>
        <img
          src="/mascot.svg"
          alt="Captain Facts"
        />
      </header>
      <p
        id="clue"
        class="clue"
      >
        {{ question.clue }}
      </p>
      <div
        class="choices"
        role="group"
        aria-labelledby="clue"
      >
        <button
          v-for="personId in question.choicePersonIds"
          :key="`${question.id}-${personId}`"
          class="choice"
          :class="{
            correct: selected !== null && personId === question.answerPersonId,
            incorrect: selected === personId && personId !== question.answerPersonId,
          }"
          :aria-disabled="selected !== null"
          :aria-pressed="selected === personId"
          @click="selectAnswer(personId)"
        >
          <img
            :src="personById(personId)!.image.path"
            alt=""
          />
          <span
            >{{ personById(personId)!.name }}
            <small v-if="selected !== null && personId === question.answerPersonId"
              >✓ Correct answer</small
            >
            <small v-else-if="selected === personId">✗ Your guess</small>
          </span>
        </button>
      </div>

      <p
        class="feedback"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ feedback }}
      </p>
      <div
        v-if="selected !== null"
        class="discovery"
      >
        <h2>A secret from history</h2>
        <p>{{ question.explanation }}</p>
        <a
          v-if="source"
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          class="source"
        >
          Source: {{ source.name }} <ExternalLink :size="16" /><span class="sr-only"
            >(opens in a new tab)</span
          >
        </a>
        <RouterLink
          :to="`/person/${answer!.id}`"
          class="profile-link"
          >Explore {{ answer!.name }}’s profile <ArrowRight :size="16"
        /></RouterLink>
        <button
          class="button navy"
          @click="advance"
        >
          {{ index === round.length - 1 ? 'Finish adventure' : 'Next Question' }}
          <ArrowRight :size="18" />
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .back-link {
    margin: 24px 0;
    min-height: 44px;
  }
  .adventure {
    max-width: 820px;
    margin: auto;
    padding: 36px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  .game-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    h1 {
      font-size: 30px;
      margin-top: 12px;
    }
    img {
      width: 80px;
    }
  }
  .clue {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 25px;
    line-height: 1.5;
    color: var(--navy);
    margin: 28px 0;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .choice {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    min-height: 88px;
    border: 2px solid var(--line);
    border-radius: 14px;
    background: var(--cream);
    text-align: left;
    font-weight: 700;
    img {
      width: 48px;
      height: 58px;
      border-radius: 24px;
      object-fit: cover;
      object-position: 50% 20%;
      flex-shrink: 0;
    }
    small {
      display: block;
      margin-top: 4px;
      font-size: 13px;
    }
    &:hover:not([aria-disabled='true']) {
      border-color: var(--navy);
    }
    &[aria-disabled='true'] {
      cursor: default;
    }
    &.correct {
      border-color: var(--navy);
      background: #e7eddf;
      animation: answer-dance 900ms ease-in-out;
    }
    &.incorrect {
      border-color: var(--red);
      background: tint(@red, 90%);
      color: var(--red);
      animation: answer-wiggle 650ms ease-in-out;
    }
  }

  @keyframes answer-wiggle {
    0%,
    100% {
      transform: translateX(0) rotate(0);
    }
    20%,
    60% {
      transform: translateX(-4px) rotate(-2deg);
    }
    40%,
    80% {
      transform: translateX(4px) rotate(2deg);
    }
  }

  @keyframes answer-dance {
    0%,
    100% {
      transform: translateY(0) rotate(0);
    }
    20%,
    60% {
      transform: translateY(-6px) rotate(-2deg);
    }
    40%,
    80% {
      transform: translateY(-3px) rotate(2deg);
    }
  }
  .feedback {
    color: var(--navy);
    font-weight: 700;
    margin-top: 24px;
    font-size: 18px;
  }
  .discovery {
    margin-top: 16px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
    h2 {
      font-size: 26px;
      margin-bottom: 14px;
    }
    p {
      font-size: 17px;
    }
    a {
      display: flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      min-height: 44px;
      text-decoration: underline;
      margin-top: 14px;
    }
    a svg {
      flex-shrink: 0;
    }
    .source {
      font-size: 14px;
    }
    .button {
      margin-top: 24px;
    }
  }
  .completion {
    text-align: center;
    img {
      width: 160px;
      margin: 0 auto 24px;
    }
    h1 {
      font-size: 34px;
    }
    p {
      margin: 22px 0;
    }
    .button {
      margin: 8px;
    }
  }
  @media (max-width: @mobile) {
    .adventure {
      padding: 24px 18px;
    }
    .choices {
      grid-template-columns: 1fr;
    }
    .clue {
      font-size: 22px;
    }
    .game-heading h1 {
      font-size: 25px;
    }
    .game-heading img {
      width: 60px;
    }
    .completion h1 {
      font-size: 28px;
    }
  }
</style>
