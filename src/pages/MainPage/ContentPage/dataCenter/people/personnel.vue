<template>
  <div class="personnel">
    <Title title="人员管理"/>
    <RouterTap :menuArr="menuArr" pathRouter="personnel"/>
  </div>
</template>

<script>
import Student from './Student' // 学生
import MasterFool from './MasterFool' // 宿管
import Assistant from './Assistant' // 辅导员
import Other from './Other' // 其他
import BlackList from './BlackList' // 黑名单
export default {
  name: 'personnel',
  data () {
    return {
    	menuArr: [{
        name: '学生',
        component: Student
      }, {
        name: '宿管',
        component: MasterFool
      }, {
        name: '辅导员',
        component: Assistant
      }, {
        name: '其他',
        component: Other
      }, {
        name: '黑名单库',
        component: BlackList
      }]
    }
  },

  mounted () {
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
