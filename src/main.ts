import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/fraunces/latin-800.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Explore from './views/Explore.vue';
import Home from './views/Home.vue';
import Detail from './views/Detail.vue';
import Random from './views/Random.vue';
import FunAndGames from './views/FunAndGames.vue';
import WhoAmI from './views/WhoAmI.vue';
import './styles/index.less';
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: Home },
    { path: '/presidents', component: Explore, props: { mode: 'presidents' } },
    { path: '/first-ladies', component: Explore, props: { mode: 'first-ladies' } },
    { path: '/topics', component: Explore, props: { mode: 'topics' } },
    { path: '/favorites', component: Explore, props: { mode: 'favorites' } },
    { path: '/person/:id', component: Detail },
    { path: '/random', component: Random },
    { path: '/games', component: FunAndGames },
    { path: '/games/who-am-i', component: WhoAmI },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
createApp(App).use(createPinia()).use(router).mount('#app');
