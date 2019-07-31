<template>
  <div class="EquipmentManagement">
    <Title title="设备管理"/>
    <RouterTap :menuArr="menuArr" pathRouter="EquipmentManagement"/>
  </div>
</template>

<script>
import ChiMou from './components/ChiMou' // 赤眸
import Gate from './components/Gate' // 闸机
import Camera from './components/Camera' // 摄像头
import LargeScreen from './components/LargeScreen' // 摄像头
import Firmware from './components/Firmware' // 固件更新
import BindTerminal from './components/BindTerminal' // 未绑定终端
import SyncLog from './components/SyncLog' // 同步日志
export default {
  name: 'EquipmentManagement',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      menuArr: [{
        name: '赤眸',
        component: ChiMou
      },
      {
        name: '摄像头',
        component: Camera
      }, {
        name: '大屏',
        component: LargeScreen
      }, {
        name: '固件更新',
        component: Firmware
      }, {
        name: '未绑定终端',
        component: BindTerminal
      }, {
        name: '同步日志',
        component: SyncLog
      }]
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';

</style>
