import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home.vue';
import List from './views/list.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/list',
    name: 'list',
    component: List,
  },
];

export default new Router({
  linkExactActiveClass: 'active',
  routes
});
