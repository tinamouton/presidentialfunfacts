<script setup lang="ts">
  import { publicAsset } from './assets';
  import { ref, onMounted, onUnmounted } from 'vue';
  import {
    Home,
    Users,
    Heart,
    BookOpen,
    Menu,
    X,
    Download,
    WifiOff,
    Sparkles,
    Gamepad2,
  } from 'lucide-vue-next';
  import { useRoute } from 'vue-router';
  import { useRegisterSW } from 'virtual:pwa-register/vue';
  import { storeToRefs } from 'pinia';
  import { createUpdatePrompt } from './pwaUpdates';
  import { useGameActivity } from './stores/gameActivity';
  import { useFavorites } from './stores/favorites';
  const route = useRoute(),
    favorites = useFavorites(),
    menuOpen = ref(false),
    online = ref(navigator.onLine);
  const { active } = storeToRefs(useGameActivity());
  let registration: ServiceWorkerRegistration | undefined;
  let lastCheck = 0;
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onNeedReload: () => updates.onNeedReload(),
    onRegisteredSW: (_url, value) => {
      registration = value;
      lastCheck = Date.now();
    },
  });
  const updates = createUpdatePrompt(needRefresh, active, updateServiceWorker, () => {
    window.location.reload();
  });
  const { visible: showUpdate, applying, error: updateError } = updates;

  async function checkForUpdate() {
    // Registration already checks on launch; throttle foreground checks to once an hour.
    if (!registration || !navigator.onLine || Date.now() - lastCheck < 60 * 60 * 1000) return;
    lastCheck = Date.now();
    try {
      await registration.update();
    } catch {
      // Offline and transient failures can retry on a later foreground visit.
    }
  }

  function onForeground() {
    if (document.visibilityState !== 'visible') return;
    updates.remind();
    void checkForUpdate();
  }

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/presidents', label: 'Presidents', icon: Users },
    { to: '/first-ladies', label: 'First Ladies', icon: Sparkles },
    { to: '/topics', label: 'Topics', icon: BookOpen },
    { to: '/games', label: 'Fun & Games', icon: Gamepad2 },
    { to: '/favorites', label: 'Favorites', icon: Heart },
  ];
  interface InstallPrompt extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: string }>;
  }
  const installPrompt = ref<InstallPrompt | null>(null);
  const onInstall = (event: Event) => {
    event.preventDefault();
    installPrompt.value = event as InstallPrompt;
  };
  const onOnline = () => {
    online.value = navigator.onLine;
  };
  function skipToContent() {
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }

  async function install() {
    await installPrompt.value?.prompt();
    await installPrompt.value?.userChoice;
    installPrompt.value = null;
  }
  onMounted(() => {
    document.addEventListener('visibilitychange', onForeground);
    window.addEventListener('beforeinstallprompt', onInstall);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOnline);
    window.addEventListener('storage', favorites.load);
  });
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onForeground);
    window.removeEventListener('beforeinstallprompt', onInstall);
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOnline);
    window.removeEventListener('storage', favorites.load);
  });
</script>
<template>
  <a
    href="#main"
    class="skip-link"
    @click.prevent="skipToContent"
  >
    Skip to content
  </a>
  <header class="site-header">
    <RouterLink
      to="/"
      class="brand"
      aria-label="PresidentialFunFacts home"
    >
      <img
        :src="publicAsset('/mascot.svg')"
        alt=""
      /><span>
        Presidential<span class="brand-red">FunFacts<span class="brand-star">✦</span></span></span
      >
    </RouterLink>
    <nav
      class="desktop-nav"
      aria-label="Main navigation"
    >
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :class="{
          active:
            route.path === link.to || (link.to === '/games' && route.path.startsWith('/games/')),
        }"
      >
        <span :class="{ 'games-label': link.to === '/games' }">
          {{ link.label }}
          <span
            v-if="link.to === '/games'"
            class="nav-stars"
            aria-hidden="true"
          >
            <span class="nav-star star-left">✦</span>
            <span class="nav-star star-left-small">★</span>
            <span class="nav-star star-right">★</span>
            <span class="nav-star star-right-small">✦</span>
          </span>
        </span>
        <span
          v-if="
            link.to === '/favorites' && favorites.saved.facts.length + favorites.saved.people.length
          "
          class="count"
        >
          {{ favorites.saved.facts.length + favorites.saved.people.length }}
        </span>
      </RouterLink>
    </nav>
    <button
      v-if="installPrompt"
      class="icon-button"
      aria-label="Install app"
      @click="install"
    >
      <Download :size="20" />
    </button>
    <button
      class="mobile-menu icon-button"
      :aria-expanded="menuOpen"
      aria-controls="mobile-menu"
      aria-label="Toggle menu"
      @click="menuOpen = !menuOpen"
    >
      <X v-if="menuOpen" /><Menu v-else />
    </button>
  </header>
  <nav
    v-if="menuOpen"
    id="mobile-menu"
    class="menu-panel"
    aria-label="More navigation"
  >
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      @click="menuOpen = false"
    >
      <component
        :is="link.icon"
        :size="20"
      />
      <span :class="{ 'games-label': link.to === '/games' }">
        {{ link.label }}
        <span
          v-if="link.to === '/games'"
          class="nav-stars"
          aria-hidden="true"
        >
          <span class="nav-star star-left">✦</span>
          <span class="nav-star star-left-small">★</span>
          <span class="nav-star star-right">★</span>
          <span class="nav-star star-right-small">✦</span>
        </span>
      </span>
    </RouterLink>
  </nav>
  <div
    v-if="!online"
    class="status-message"
    role="status"
  >
    <WifiOff :size="16" />
    You’re offline. Your facts and portraits are still here; source websites need a connection.
  </div>
  <div
    v-if="favorites.storageError"
    class="status-message"
    role="status"
  >
    {{ favorites.storageError }}
  </div>
  <section
    v-if="showUpdate"
    class="update-banner"
    aria-label="Application update"
  >
    <div role="status">
      <strong>A fresh version is ready!</strong>
      <p>PresidentialFunFacts has a little update. You can install it whenever you're ready!</p>
      <p v-if="updateError">{{ updateError }}</p>
    </div>
    <button
      :disabled="applying"
      @click="updates.updateNow"
    >
      {{ applying ? 'Updating…' : 'Update now' }}
    </button>
    <button @click="updates.later">Later</button>
  </section>
  <main
    id="main"
    tabindex="-1"
  >
    <RouterView />
  </main>
  <footer class="site-footer">
    <RouterLink
      to="/"
      class="footer-wordmark"
    >
      Presidential<span>FunFacts</span>
    </RouterLink>
    <p>Little-known facts. Big personalities.</p>
    <span>Curiosity welcome. Sources included.</span>
    <span
      class="footer-stars"
      aria-hidden="true"
    >
      ✦ ★ ✦
    </span>
  </footer>
  <nav
    class="bottom-nav"
    aria-label="Mobile navigation"
  >
    <RouterLink
      v-for="link in links.filter((l) => l.to !== '/first-ladies')"
      :key="link.to"
      :to="link.to"
      :class="{
        active:
          route.path === link.to || (link.to === '/games' && route.path.startsWith('/games/')),
      }"
    >
      <component
        :is="link.icon"
        :size="21"
      />
      <span :class="{ 'games-label': link.to === '/games' }">
        {{ link.label }}
        <span
          v-if="link.to === '/games'"
          class="nav-stars"
          aria-hidden="true"
        >
          <span class="nav-star star-left">✦</span>
          <span class="nav-star star-left-small">★</span>
          <span class="nav-star star-right">★</span>
          <span class="nav-star star-right-small">✦</span>
        </span>
      </span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="less">
  @import (reference) './styles/variables.less';

  .site-header {
    max-width: 1264px;
    margin: auto;
    height: 108px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    gap: 24px;
    @media (max-width: @tablet) {
      padding: 0 30px;
      height: 95px;
    }
    @media (max-width: @mobile) {
      padding: 0 20px;
      height: 84px;
    }
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 1.03;
    font-family: 'Fraunces', Georgia, serif;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -1px;
    img {
      width: 51px;
      height: 64px;
    }
    @media (max-width: @tablet) {
      font-size: 21px;
    }
    @media (max-width: @mobile) {
      font-size: 20px;
      gap: 6px;
      img {
        width: 42px;
        height: 54px;
      }
    }
  }
  .brand-red {
    display: block;
    color: var(--red);
    font-size: 27px;
    @media (max-width: @tablet) {
      font-size: 24px;
    }
    @media (max-width: @mobile) {
      font-size: 24px;
    }
  }
  .brand-star {
    font-size: 17px;
    color: var(--gold);
    margin-left: 6px;
  }
  .desktop-nav {
    display: flex;
    gap: 18px;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    a {
      position: relative;
      padding: 13px 0;
    }
    a.active {
      color: var(--red);
    }
    a.active:after {
      content: '';
      height: 3px;
      width: 22px;
      bottom: 2px;
      left: 0;
      position: absolute;
      background: var(--red);
      border-radius: 4px;
    }
    @media (max-width: @desktop) {
      gap: 20px;
    }
    @media (max-width: @tablet) {
      gap: 10px;
      font-size: 11px;
    }
    @media (max-width: @mobile) {
      display: none;
    }
  }
  .games-label {
    position: relative;
    display: inline-block;
    white-space: nowrap;
  }
  .nav-stars {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .nav-star {
    position: absolute;
    color: var(--gold);
    line-height: 1;
    font-size: 11px;
    transform: rotate(-12deg);
  }
  .star-left {
    left: -7px;
    top: -4px;
  }
  .star-right {
    right: -7px;
    top: -2px;
    font-size: 8px;
    transform: rotate(15deg);
  }
  .star-left-small {
    left: -1px;
    top: -7px;
    font-size: 6px;
    transform: rotate(12deg);
  }
  .star-right-small {
    right: -1px;
    top: -5px;
    font-size: 6px;
    transform: rotate(-8deg);
  }
  a:hover .nav-star,
  a:focus-visible .nav-star {
    animation: nav-twinkle 700ms ease-in-out;
  }
  a:hover .star-right,
  a:focus-visible .star-right {
    animation-delay: 100ms;
  }
  a:hover .star-left-small,
  a:focus-visible .star-left-small,
  a:hover .star-right-small,
  a:focus-visible .star-right-small {
    animation-delay: 150ms;
  }
  @keyframes nav-twinkle {
    0%,
    100% {
      scale: 1;
      translate: 0 0;
    }
    45% {
      scale: 1.25;
      translate: 0 -2px;
    }
    70% {
      scale: 0.95;
      translate: 0 0;
    }
  }
  .count {
    font-size: 10px;
    border-radius: 20px;
    background: var(--red);
    color: white;
    padding: 2px 6px;
    margin-left: 4px;
  }
  .mobile-menu {
    display: none;
    &.icon-button {
      display: none;
    }
    @media (max-width: @mobile) {
      display: flex;
      &.icon-button {
        display: flex;
      }
    }
  }
  .bottom-nav {
    display: none;
    @media (max-width: @mobile) {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 40;
      background: #fffaf0f7;
      border-top: 1px solid var(--line);
      justify-content: space-around;
      padding: 10px 8px max(10px, env(safe-area-inset-bottom));
      backdrop-filter: blur(12px);
      a {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 4px;
        font-size: 9px;
        color: #7a8276;
        min-width: 50px;
      }
      a.active {
        color: var(--navy);
        font-weight: 800;
      }
      a.active svg {
        fill: #12364a12;
      }
    }
  }
  main {
    max-width: 1184px;
    padding: 0 0 20px;
    margin: 0 auto;
    @media (max-width: @desktop) {
      margin: 0 35px;
    }
    @media (max-width: @mobile) {
      margin: 0 20px;
    }
    @media (max-width: @small-mobile) {
      margin: 0 14px;
    }
  }
  .site-footer {
    max-width: 1184px;
    border-top: 1px solid var(--line);
    margin: 35px auto 0;
    padding: 28px 0 35px;
    position: relative;
    text-align: center;
    p {
      font-size: 12px;
      margin-top: 7px;
    }
    > span:not(.footer-stars) {
      font-size: 10px;
      color: #928575;
    }
    @media (max-width: @desktop) {
      margin-left: 35px;
      margin-right: 35px;
    }
    @media (max-width: @mobile) {
      padding-bottom: 110px;
      margin: 30px 20px 0;
    }
  }
  .footer-wordmark {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 20px;
    font-weight: 800;
    > span {
      color: var(--red);
    }
  }
  .footer-stars {
    color: var(--gold);
    display: block;
    margin-top: 15px;
    letter-spacing: 8px;
    font-size: 12px;
  }
  .status-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #e8e3ce;
    padding: 12px 20px;
    font-size: 12px;
    @media (max-width: @mobile) {
      font-size: 10px;
      align-items: flex-start;
      svg {
        flex-shrink: 0;
      }
    }
  }
  .update-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 20px;
    flex-wrap: wrap;
    font-size: 14px;
    background: var(--navy);
    color: var(--paper);
    position: sticky;
    top: 0;
    z-index: 20;
    button {
      background: var(--paper);
      color: var(--navy);
      border: 0;
      border-radius: 7px;
      padding: 10px 16px;
      min-height: 44px;
      font-size: 12px;
    }
    button:last-child {
      display: flex;
      padding: 10px 16px;
      background: transparent;
      color: var(--paper);
    }
    @media (max-width: @mobile) {
      font-size: 11px;
    }
  }
  .menu-panel {
    display: none;
    @media (max-width: @mobile) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: absolute;
      top: 76px;
      right: 20px;
      left: 20px;
      background: var(--paper);
      padding: 15px;
      gap: 6px;
      z-index: 30;
      border: 1px solid var(--line);
      border-radius: 17px;
      box-shadow: 0 12px 30px #12364a22;
      a {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 12px;
        font-size: 12px;
        border-radius: 9px;
      }
      a:hover {
        background: #eee8d8;
      }
    }
  }
  .skip-link {
    position: fixed;
    top: -60px;
    left: 10px;
    background: var(--navy);
    color: white;
    padding: 10px 20px;
    z-index: 100;
    &:focus {
      top: 10px;
    }
  }
</style>
