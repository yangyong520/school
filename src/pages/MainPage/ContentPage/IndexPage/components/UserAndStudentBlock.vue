<template>
  <div class="UserAndStudentBlock_bottom">
    <div class="item-box">
      <BlockTopBottom/>
    </div>
    <div class="item-box">
      <BlockLeftAndRight/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAndStudentBlock_bottom',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.UserAndStudentBlock_bottom {
  width: 50%;
  display: flex;
  .item-box{
    flex: 1;
    margin-right: 10px;
  }
}
</style>
