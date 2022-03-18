import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);

import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    // key: "AIzaSyCjtuhrYRCNX2BISz_gnebCWbGvY5pxrfk",
    key: "AIzaSyCqd1XS0Jt-VUrhm_x1nY9bmQEk5xwf8Sc", //Dung OK
    // key: "AIzaSyB_WhUHEz1vlPiBEC4-9Z2Xf6TvrJ2gZjI",
    libraries: "places", // This is required if you use the Autocomplete plugin
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");

