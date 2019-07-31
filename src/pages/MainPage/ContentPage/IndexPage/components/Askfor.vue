<template>
  <div class="Askfor">
    <div class="data-thing-block">
      <div class="data-thing-block-title">
        <span>{{title}}</span>
        <span @click="$router.push('/mainPage/applicationNotes/0')">去查看</span>
      </div>
      <ul class="data-thing-ul">
        <li v-for="(item,index) in dataArr" :key="index">
          <span>
            <i class="iconfont" :class="item.icon" :style="{color: item.iconColor}"></i>
          </span>
          <div>
            <span class="count-box">{{item.val}}</span>
            <span class="content-box">{{item.title}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Askfor",
  props: {
    dataArr: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: "待处理申请"
    }
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

</style>
