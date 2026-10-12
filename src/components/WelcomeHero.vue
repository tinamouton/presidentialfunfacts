<script setup lang="ts">
  import { ArrowRight, Shuffle, BadgeCheck } from 'lucide-vue-next';
</script>

<template>
  <section class="hero">
    <div class="hero-copy">
      <div class="hero-kicker"><span>✦</span> A LITTLE CURIOSITY. A LOT OF HISTORY.</div>
      <h1>Big personalities.<br /><span>Surprising stories.</span></h1>
      <p>
        Meet the humans behind the history.<br />Discover the unexpected side of America’s
        presidents<br class="desktop-break" />
        and the women who helped shape their world.
      </p>
      <div class="hero-actions">
        <RouterLink
          to="/presidents"
          class="button red"
          >Explore the presidents <ArrowRight :size="18" /></RouterLink
        ><RouterLink
          to="/random"
          class="button cream"
          ><Shuffle :size="18" /> Surprise me</RouterLink
        >
      </div>
      <div class="hero-proof">
        <BadgeCheck :size="17" /> Real history. Trusted sources. Endless “I didn’t know that!”
      </div>
    </div>
    <div class="hero-art">
      <span
        class="hero-star star-one"
        aria-hidden="true"
        >✦</span
      ><span
        class="hero-star star-two"
        aria-hidden="true"
        >★</span
      ><span
        class="hero-star star-three"
        aria-hidden="true"
        >✧</span
      >
      <div class="speech">History doesn’t<br />have to be boring!</div>
      <img
        class="captain"
        src="/mascot.svg"
        alt="Captain Facts, a smiling Uncle Sam hat mascot" />
      <div class="hill hill-back"></div>
      <div class="hill hill-front"></div>
      <svg
        class="white-house"
        viewBox="0 0 280 140"
        aria-hidden="true">
        <path
          d="M22 62h236v64H22z"
          fill="#f8eed8"
          stroke="#97aaa0"
          stroke-width="3" />
        <path
          d="M70 48h140v80H70z"
          fill="#fff9ec"
          stroke="#97aaa0"
          stroke-width="3" />
        <path
          d="m59 50 81-37 81 37z"
          fill="#fff9ec"
          stroke="#97aaa0"
          stroke-width="3" />
        <path
          d="M85 58v59m27-59v59m55-59v59m28-59v59"
          stroke="#cfceb8"
          stroke-width="9" />
        <path
          d="M130 123L130 83h18v40"
          fill="#12364a" />
        <path
          d="M10 129h260M140 12V0"
          stroke="#97aaa0"
          stroke-width="3" />
        <path
          d="M140 0h28v14h-28"
          fill="#cb4a39" />
        <g fill="#7699a5">
          <path d="M34 76h13v21H34zm20 0h13v21H54zm160 0h13v21h-13zm20 0h13v21h-13z" />
        </g>
      </svg>
      <div class="captain-label">YOUR GUIDE, CAPTAIN FACTS</div>
    </div>
  </section>
</template>

<style scoped lang="less">
  @import (reference) '../styles/variables.less';

  .hero {
    display: grid;
    grid-template-columns: 1.18fr 1fr;
    min-height: 440px;
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    background: #e7eddf;
    border: 1px solid #dedfcf;
    h1 {
      font-size: clamp(35px, 3.65vw, 50px);
      line-height: 1.13;
    }
    h1 > span {
      color: var(--red);
    }
    @media (min-width: @wide-desktop) {
      min-height: 468px;
    }
    @media (max-width: @desktop) {
      h1 {
        font-size: 43px;
      }
    }
    @media (max-width: @tablet) {
      grid-template-columns: 1.2fr 1fr;
      min-height: 410px;
      h1 {
        font-size: 36px;
      }
    }
    @media (max-width: @mobile) {
      display: flex;
      flex-direction: column;
      min-height: 0;
      border-radius: 22px;
      h1 {
        font-size: 33px;
      }
    }
    @media (max-width: @small-mobile) {
      h1 {
        font-size: 30px;
      }
    }
  }
  .hero-copy {
    padding: 55px 0 42px 47px;
    z-index: 2;
    > p {
      font-size: 14px;
      line-height: 1.85;
      margin-top: 20px;
      color: #536866;
    }
    @media (min-width: @wide-desktop) {
      padding-top: 64px;
    }
    @media (max-width: @desktop) {
      padding-left: 32px;
    }
    @media (max-width: @tablet) {
      padding: 40px 0 30px 28px;
      > p {
        font-size: 12px;
      }
    }
    @media (max-width: @mobile) {
      padding: 30px 25px 0;
      text-align: center;
      > p {
        font-size: 12px;
        line-height: 1.75;
        margin-top: 14px;
      }
    }
    @media (max-width: @small-mobile) {
      padding: 27px 16px 0;
    }
  }
  .hero-kicker {
    font-weight: 800;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    font-size: 10px;
    letter-spacing: 1.1px;
    margin-bottom: 20px;
    span {
      font-size: 19px;
      color: var(--red);
    }
    @media (max-width: @mobile) {
      font-size: 8px;
      letter-spacing: 0.8px;
      gap: 7px;
      margin-bottom: 13px;
    }
  }
  .hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 25px;
    @media (max-width: @tablet) {
      gap: 8px;
      .button {
        font-size: 11px;
        padding: 10px 12px;
      }
    }
    @media (max-width: @mobile) {
      justify-content: center;
      margin-top: 19px;
      gap: 9px;
      .button {
        font-size: 11px;
        padding: 10px 14px;
      }
    }
    @media (max-width: @small-mobile) {
      .button {
        padding: 10px;
        font-size: 10px;
      }
    }
  }
  .hero-proof {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    margin-top: 24px;
    color: #576c65;
    @media (max-width: @desktop) {
      font-size: 9px;
    }
    @media (max-width: @tablet) {
      max-width: 240px;
      align-items: flex-start;
      svg {
        flex-shrink: 0;
      }
    }
    @media (max-width: @mobile) {
      justify-content: center;
      max-width: none;
      font-size: 8px;
      margin-top: 17px;
      gap: 5px;
    }
    @media (max-width: @small-mobile) {
      font-size: 7px;
    }
  }
  .hero-art {
    position: relative;
    align-self: stretch;
    background: radial-gradient(ellipse at center, #e9e9cc00 25%, #e9e9cc99 100%);
    @media (max-width: @mobile) {
      width: 100%;
      margin-top: 5px;
      height: 254px;
    }
  }
  .captain {
    position: absolute;
    bottom: 24px;
    left: 65px;
    width: 290px;
    height: 320px;
    z-index: 4;
    transform: rotate(-7deg);
    @media (min-width: @wide-desktop) {
      width: 310px;
      height: 345px;
    }
    @media (max-width: @desktop) {
      left: 2px;
      width: 270px;
    }
    @media (max-width: @tablet) {
      width: 245px;
      left: -5px;
      bottom: 24px;
    }
    @media (max-width: @mobile) {
      width: 219px;
      left: calc(50% - 129px);
      transform: rotate(-8deg);
      bottom: 16px;
      height: 236px;
    }
  }
  .speech {
    position: absolute;
    top: 35px;
    right: 49px;
    background: var(--paper);
    padding: 19px 24px;
    border-radius: 24px 24px 24px 3px;
    transform: rotate(5deg);
    font-family: 'Fraunces', Georgia, serif;
    line-height: 1.4;
    font-size: 21px;
    box-shadow: 0 4px 0 #12364a07;
    z-index: 5;
    &:after {
      content: '';
      position: absolute;
      border: 13px solid transparent;
      border-top-color: var(--paper);
      bottom: -23px;
      left: 25px;
    }
    @media (max-width: @desktop) {
      right: 27px;
      font-size: 19px;
    }
    @media (max-width: @tablet) {
      font-size: 17px;
      right: 16px;
      padding: 16px;
      top: 32px;
    }
    @media (max-width: @mobile) {
      font-size: 15px;
      padding: 11px 15px;
      top: 12px;
      right: 24px;
      border-radius: 18px 18px 18px 3px;
    }
    @media (max-width: @small-mobile) {
      right: 12px;
      font-size: 13px;
    }
  }
  .hero-star {
    position: absolute;
    color: var(--gold);
    font-size: 40px;
    z-index: 5;
  }
  .star-one {
    left: 19px;
    top: 75px;
    transform: rotate(15deg);
    @media (max-width: @mobile) {
      font-size: 30px;
      left: 35px;
      top: 40px;
    }
  }
  .star-two {
    right: 26px;
    top: 210px;
    font-size: 28px;
    @media (max-width: @mobile) {
      font-size: 24px;
      right: 22px;
      top: 119px;
    }
  }
  .star-three {
    left: 9px;
    top: 195px;
    color: #83a6a4;
    @media (max-width: @mobile) {
      left: 15px;
      top: 133px;
      font-size: 25px;
    }
  }
  .hill {
    position: absolute;
    border-radius: 50% 50% 0 0;
    width: 650px;
    height: 180px;
    bottom: -84px;
    right: -230px;
    background: #a5b595;
    @media (max-width: @mobile) {
      height: 120px;
      bottom: -63px;
      right: -200px;
    }
  }
  .hill-back {
    bottom: -35px;
    right: -275px;
    background: #c1cbaa;
    height: 195px;
    transform: rotate(-7deg);
    @media (max-width: @mobile) {
      bottom: -32px;
      right: -275px;
      height: 130px;
    }
  }
  .white-house {
    position: absolute;
    width: 232px;
    bottom: 75px;
    right: -24px;
    z-index: 2;
    opacity: 0.9;
    @media (max-width: @tablet) {
      width: 185px;
      bottom: 60px;
    }
    @media (max-width: @mobile) {
      width: 163px;
      right: -3px;
      bottom: 47px;
    }
  }
  .captain-label {
    position: absolute;
    bottom: 12px;
    left: 66px;
    font-size: 8px;
    letter-spacing: 1.7px;
    font-weight: 800;
    z-index: 5;
    @media (max-width: @tablet) {
      left: 20px;
    }
    @media (max-width: @mobile) {
      left: calc(50% - 103px);
      font-size: 7px;
      bottom: 8px;
    }
  }
  .desktop-break {
    @media (max-width: @mobile) {
      display: none;
    }
  }
</style>
