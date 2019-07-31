<template>
  <div class="TodayData">
    <div class="data-thing-block">
      <div class="data-thing-block-title">
        <span>{{title}}</span>
      </div>
      <ul class="data-thing-ul">
        <li v-for="(item,index) in dataArr" :key="index">
          <span>
            <i class="iconfont" :class="item.icon" :style="{color: item.iconColor}"></i>
          </span>
          <div>
            <span class="count-box">{{item.count}}</span>
            <span class="content-box">{{item.itemName}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "TodayData",
  props: {
    title: {
      type: String,
      default: "今日概况"
    },
    dataArr: {
      type: Array,
      default: []
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
