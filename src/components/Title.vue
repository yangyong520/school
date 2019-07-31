<template>
  <div
    class="Title"
    :style="{margin,fontSize,borderLeft}">
    <span class="l-title">
      {{title}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  props: {
    title: {
      type: String,
      default: 'title'
    },
    margin: {
      type: String,
      default: '0'
    },
    fontSize: {
      type: String,
      default: '18px'
    },
    borderLeft: {
      type: String,
      default: '5px solid #1b87e2'
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../global.less';
.l-title{
  // border-left: 5px solid @styleColor;
  padding-left: 15px;
  font-weight: bold;
}
</style>
