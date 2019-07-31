// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from './registe'
import App from './App'
import router from './router'
import { store } from './store/store'// vuex//全局数据
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import viserVue from 'viser-vue' // 統計圖
import VueStorage from 'vue-ls'

Vue.use(viserVue)
Vue.use(Antd)
Vue.use(VueStorage, {
  namespace: 'pro__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
})

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

vm.$message.config({ maxCount: 1 })
