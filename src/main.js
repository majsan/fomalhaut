import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import promiseFinally from 'promise.prototype.finally'

promiseFinally.shim(); // For Firefox and Edge, should soon be supported natively

Vue.use(BootstrapVue);

Vue.config.productionTip = false

Vue.directive('autofocus', {
  inserted: function (el) {
    el.focus()
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
