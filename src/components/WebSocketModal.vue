<template>
  <div class="test">
    <a-modal v-model="visible" title="警告" :maskClosable="false" okText="点击查看" @ok="routerLink" @cancel="cancel">
      <div class="router-link">
        {{msg}}
      </div>
    </a-modal>
  </div>
</template>

<script>
import { baseUrl } from '@/baseUrl'

export default {
  name: 'WebSocket-modal',
  data() {
    return {
      visible: false,
      websock: null,
      timer: null,
      count: 0,
      msg: ''
    }
  },
  mounted () {
    this.initWebSocket()
  },
  // destroyed() {
  //   this.websock.close() // 离开路由之后断开websocket连接
  // },
  methods: {
    cancel () {
      this.visible = false
      this.msg = ''
    },
    routerLink () {
      this.$router.push('/mainPage/equipmentManagement/0?type=0')
      this.visible = false
      this.msg = ''
    },
    initWebSocket () { // 初始化weosocket
      if ('WebSocket' in window) {
        const wsuri = baseUrl + '/websocketOffLine'
        this.websock = new WebSocket(wsuri.replace('http', 'ws'))
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      } else {
        alert('当前浏览器不支持！')
      }
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      this.websocketsend()
    },
    websocketonerror () {// 连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage (e) { // 数据接收
      const redata = e.data
      if (redata !== '200') {
        this.msg = redata
        this.visible = true
      }
      // if (redata !== '200' && this.count === 0) {
        // this.startCount()
      // }
    },
    websocketsend () {// 数据发送
      this.websock.send('')
    },
    websocketclose (e) {  // 关闭
      console.log('断开连接', e)
    },
    startCount () {
      this.timer = setInterval(() => {
        this.count++
      }, 1000)
    }
  },
  watch: {
    // count () {
    //   if (this.msg) {
    //     this.visible = true
    //   }
    // },
    visible () {
      if (this.visible) {
        this.websock.close()
      } else {
        this.initWebSocket()
      }
    }
  }
}
</script>
<style lang='less'>

.router-link {
  cursor: pointer;
}
</style>
