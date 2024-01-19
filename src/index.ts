import './components/app/root/root.component.js';

import { Route, Router } from '@vaadin/router';

import { injectGlobalStyles } from './utils/style.utils.js';

import styles from './index.scss';

// inject global style
injectGlobalStyles('asm.globals', styles as string);

export const GAMES = [
  {
    path: '/games/math-quests',
    component: 'asm-math-quests',
    name: 'Mathe',
    action: async () => {
      await import('./components/games/math-quests/math-quests/math-quests.component.js');
    },
  },
  {
    path: '/games/memory',
    component: 'asm-memory',
    name: 'Memory',
    action: async () => {
      await import('./components/games/memory/memory/memory.component.js');
    },
  },
  {
    path: '/games/connect-four',
    component: 'asm-connect-four',
    name: 'Vier gewinnt',
    action: async () => {
      await import('./components/games/connect-four/connect-four/connect-four.component.js');
    },
  },
] satisfies Route[];

// define routes
const ROUTES = [
  {
    path: '/',
    component: 'asm-root',
    children: [
      {
        path: '/',
        redirect: '/games/memory',
      },
      ...GAMES,
    ],
  },
] satisfies Route[];

// initialize
// https://www.thisdot.co/blog/routing-management-with-litelement
// https://github.com/vaadin/router/blob/master/README.md
export const router = new Router(document.body);
router.setRoutes(ROUTES);
