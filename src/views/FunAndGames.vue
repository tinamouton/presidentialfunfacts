<script setup lang="ts">
  import { publicAsset } from '../assets';
  import { ArrowRight } from 'lucide-vue-next';
</script>

<template>
  <header class="page-head">
    <span class="eyebrow">CURIOSITY AT PLAY</span>
    <h1>Fun &amp; Games</h1>
    <p>Put on your detective hat! Captain Facts has a few historical secrets to share.</p>
  </header>

  <section
    class="game-card"
    aria-labelledby="game-title"
  >
    <img
      :src="publicAsset('/mascot.svg')"
      alt="Captain Facts, your smiling history guide"
    />
    <div>
      <span class="eyebrow">FIVE CLUES. A LITTLE ADVENTURE.</span>
      <h2 id="game-title">Who Am I?</h2>
      <p>
        Meet a mystery person from history. Follow the clue, pick a name, and discover their story!
      </p>
      <RouterLink
        to="/games/who-am-i"
        class="button navy"
        >Play Who Am I? <ArrowRight :size="18"
      /></RouterLink>
    </div>
  </section>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .game-card {
    display: flex;
    align-items: center;
    gap: 48px;
    padding: 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: #e7eddf;
    box-shadow: var(--shadow);
    img {
      width: 210px;
    }
    h2 {
      margin: 12px 0 18px;
      font-size: 40px;
    }
    p {
      max-width: 500px;
      font-size: 17px;
    }
    .button {
      margin-top: 26px;
    }
    @media (max-width: @mobile) {
      flex-direction: column;
      text-align: center;
      gap: 24px;
      padding: 26px;
      img {
        width: 140px;
      }
      h2 {
        font-size: 34px;
      }
      p {
        font-size: 16px;
      }
    }
  }
</style>
