import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
//import About from './views/About.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/rcm-vue-master/',
      name: 'home',
      component: Home
    },
    {
      path: '/rcm-vue-master/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/rcm-vue-master/loyalty',
      name: 'loyalty',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Loyalty.vue')
    },
    {
      path: '/rcm-vue-master/loyalty/:postSlug',
      name: 'loyalty-single',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Loyalty-single.vue')
    },
    {
      path: '/rcm-vue-master/redeem',
      name: 'load-qr-reader',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/load_qr_reader.vue')
    }
  ]
})
