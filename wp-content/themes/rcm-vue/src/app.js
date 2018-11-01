window.SETTINGS = {
  // How many different dispatched actions determine loading progress
  // This is likely determined by how many dispatched actions you have below
  // in the created() method
  LOADING_SEGMENTS: 2,
  API_BASE_PATH: '/rcm-vue/wp-json/wp/v2/'
}


import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import VueLazyload from 'vue-lazyload'
import VueQrcodeReader from 'vue-qrcode-reader'
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(VueQrcodeReader)
//Vue.use(VueAxios, axios)

// const HelloJs = require('hellojs/dist/hello.all.min.js');
// const VueHello = require('vue-hellojs');
//import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(VueLazyload)


// HelloJs.init({
//   google:  '829548674032-uthu7793om5dcua11fd73liaer7vgdqf.apps.googleusercontent.com' ,
//   facebook: '461932777641788'
// }, {
//   redirect_uri: 'authcallback/'
// });
// Vue.use(VueHello, HelloJs);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
