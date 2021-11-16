import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { router } from './routes'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex';
import VueMask from 'v-mask'
import money from "v-money";
import UtilsService from './service/utilsService';
import * as VueGoogleMaps from "vue2-google-maps"; // Import package

Vue.config.productionTip = false

Vue.use(VueMask);
Vue.use(VueAxios, axios); 
Vue.use(money, {precision:4});

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAfrtV0BQ5k2GUJCgMaTsneZJ7XpmdRZeI",
    libraries: "places"
  }
});

Vue.filter('formatData',(val) => UtilsService.formatData(val))
Vue.filter('formatCPF',(val) => UtilsService.formatCPF(val))
Vue.filter('protectCPF',(val) => UtilsService.protectCPF(val))
Vue.filter('weekDay',(val) => UtilsService.getWeekDay(val))

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')