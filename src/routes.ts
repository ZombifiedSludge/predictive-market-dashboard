import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';
import Home from './pages/home';
import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./widgets/Dashboard')),  // Changed to use Dashboard
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/blog',
    component: lazy(() => import('./widgets/Blog')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
