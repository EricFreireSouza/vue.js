import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App'

Vue.use(BootstrapVue)

/* eslint-disable no-new */

var localCeps = localStorage.getItem('cepss')

if(localCeps == null || (typeof localCeps == 'string' && !localCeps.length)){
	localCeps = '[]'
}

Vue.prototype.$ceps = JSON.parse(localCeps)

new Vue({
  el: '#app',
  render: h => h(App) 
})
