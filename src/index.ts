import { Route, Router } from '@vaadin/router';
import { injectGlobalStyles } from './utils/style.utils';

import styles from './index.scss';

// inject global style
injectGlobalStyles('asm.globals', styles as string);

// define routes
const routes: Route[] = [
  {
    path: '/',
    component: 'asm-root',
    children: [
      {
        path: '',
        redirect: '/games/memory',
      },
      {
        path: '/games/memory',
        component: 'asm-memory',
        action: async () => {
          await import('./components/games/memory/memory/memory.component');
        },
      },
    ],
  },
];

// intialize
// https://www.thisdot.co/blog/routing-management-with-litelement
// https://github.com/vaadin/router/blob/master/README.md
export const router = new Router(document.body);
router.setRoutes(routes);
