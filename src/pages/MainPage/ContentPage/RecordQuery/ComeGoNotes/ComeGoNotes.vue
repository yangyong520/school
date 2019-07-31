<template>
  <div class="ComeGoNotes">
    <Title title="出入记录"/>
    <RouterTap :menuArr="menuArr" pathRouter="ComeGoNotes"/>
  </div>
</template>

<script>
import ComeGo from './components/ComeGo' // 出入
import Attendance from './components/Attendance' // 楼栋管理
export default {
  name: 'ComeGoNotes',
  data () {
    return {
      menuArr: [{
        name: '出入记录',
        component: ComeGo
      }, {
        name: '考勤分析',
        component: Attendance
      }]
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';

</style>
