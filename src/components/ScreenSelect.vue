<template>
  <div class="ScreenSelect">
    <div class="btn-box" @click="visible = !visible">
      <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenSelect',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/global';

</style>
